import sql from "../configs/db.js";

export const getUserCreations = async (req, res) => {
    try {
        const userId = req.auth();
        const creations = await sql`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;
        res.json({ success: true, creations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPublishedCreations = async (req, res) => {
    console.log('🔍 Starting getPublishedCreations...');
    
    try {
        // 1. Test database connection
        try {
            console.log('🔌 Testing database connection...');
            await sql`SELECT 1`;
            console.log('✅ Database connection successful');
        } catch (dbError) {
            console.error('❌ Database connection failed:', {
                message: dbError.message,
                code: dbError.code,
                detail: dbError.detail,
                hint: dbError.hint
            });
            return res.status(500).json({
                success: false,
                message: 'Database connection failed',
                error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
            });
        }

        // 2. Check if table exists
        try {
            console.log('🔍 Checking if table exists...');
            const tableExists = await sql`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'creations'
                );
            `;
            console.log('📊 Table exists:', tableExists[0]?.exists);
            
            if (!tableExists[0]?.exists) {
                throw new Error('Table "creations" does not exist');
            }
        } catch (tableError) {
            console.error('❌ Table check failed:', {
                message: tableError.message,
                code: tableError.code,
                detail: tableError.detail
            });
            return res.status(500).json({
                success: false,
                message: 'Error checking database tables',
                error: process.env.NODE_ENV === 'development' ? tableError.message : undefined
            });
        }

        // 3. Get published creations
        try {
            console.log('📡 Fetching published creations...');
            const creations = await sql`
                SELECT id, content, prompt, created_at, likes
                FROM creations 
                WHERE published = true 
                ORDER BY created_at DESC
                LIMIT 50
            `;
            
            console.log(`✅ Successfully fetched ${creations.length} creations`);
            
            return res.json({
                success: true,
                message: 'Creations fetched successfully',
                creations: creations.map(c => ({
                    ...c,
                    likes: Array.isArray(c.likes) ? c.likes : []
                }))
            });
            
        } catch (queryError) {
            console.error('❌ Query failed:', {
                message: queryError.message,
                code: queryError.code,
                detail: queryError.detail,
                hint: queryError.hint,
                position: queryError.position,
                where: queryError.where
            });
            
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch creations',
                error: process.env.NODE_ENV === 'development' ? queryError.message : undefined,
                details: process.env.NODE_ENV === 'development' ? {
                    code: queryError.code,
                    detail: queryError.detail,
                    hint: queryError.hint
                } : undefined
            });
        }
        
    } catch (error) {
        console.error('❌ Unexpected error in getPublishedCreations:', {
            message: error.message,
            stack: error.stack,
            ...(error.code && { code: error.code }),
            ...(error.detail && { detail: error.detail })
        });
        
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const toggleLikeCreations = async (req, res) => {
    try {
        const userId = req.auth();
        const { id } = req.body;

        const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;

        if (!creation) {
            return res.status(404).json({ success: false, message: 'Creation not found' });
        }

        const currentLikes = creation.likes || [];
        const userIdStr = userId.toString();
        let updatedLikes;
        let message;

        if (currentLikes.includes(userIdStr)) {
            updatedLikes = currentLikes.filter(user => user !== userIdStr);
            message = 'Creation Unliked';
        } else {
            updatedLikes = [...currentLikes, userIdStr];
            message = 'Creation Liked';
        }

        await sql`UPDATE creations SET likes = ${updatedLikes}::text[] WHERE id = ${id}`;

        res.json({ success: true, message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getDashboardData = async (req, res) => {
    console.log('🔍 Starting getDashboardData...');
    
    try {
        // 1. Get user ID from auth
        let userId;
        try {
            userId = req.auth();
            console.log('✅ Authenticated user ID:', userId);
            if (!userId) throw new Error('No user ID found in auth');
        } catch (authError) {
            console.error('❌ Authentication error:', authError);
            return res.status(401).json({
                success: false,
                message: 'Authentication failed',
                error: process.env.NODE_ENV === 'development' ? authError.message : undefined
            });
        }

        // 2. Check if user exists in database
        let userExists;
        try {
            userExists = await sql`SELECT 1 FROM users WHERE clerk_id = ${userId} LIMIT 1`;
            console.log('✅ User exists in database:', userExists.length > 0);
            if (userExists.length === 0) {
                throw new Error(`User ${userId} not found in database`);
            }
        } catch (userError) {
            console.error('❌ User check failed:', userError);
            return res.status(404).json({
                success: false,
                message: 'User not found in database',
                error: process.env.NODE_ENV === 'development' ? userError.message : undefined
            });
        }

        // 3. Get total creations count
        let totalCreations;
        try {
            console.log('📊 Fetching total creations count...');
            totalCreations = await sql`
                SELECT COUNT(*) as count FROM creations 
                WHERE user_id = ${userId}
            `;
            console.log('✅ Total creations:', totalCreations[0]?.count || 0);
        } catch (countError) {
            console.error('❌ Error counting creations:', {
                message: countError.message,
                code: countError.code,
                detail: countError.detail,
                hint: countError.hint
            });
            // Don't fail the whole request, just show 0
            totalCreations = [{ count: '0' }];
        }

        // 4. Get user's plan info
        let userPlan;
        try {
            console.log('💳 Fetching user plan...');
            userPlan = await sql`
                SELECT plan, plan_expires 
                FROM users 
                WHERE clerk_id = ${userId}
                LIMIT 1
            `;
            console.log('✅ User plan:', userPlan[0] || 'free');
        } catch (planError) {
            console.error('❌ Error fetching user plan:', planError);
            // Default to free plan if there's an error
            userPlan = [];
        }

        // 5. Get recent creations (last 5)
        let recentCreations;
        try {
            console.log('🖼️ Fetching recent creations...');
            recentCreations = await sql`
                SELECT * FROM creations 
                WHERE user_id = ${userId}
                ORDER BY created_at DESC 
                LIMIT 5
            `;
            console.log(`✅ Found ${recentCreations.length} recent creations`);
        } catch (creationsError) {
            console.error('❌ Error fetching recent creations:', {
                message: creationsError.message,
                code: creationsError.code,
                detail: creationsError.detail
            });
            // Return empty array if there's an error
            recentCreations = [];
        }

        // 6. Prepare response
        const response = {
            success: true,
            data: {
                totalCreations: parseInt(totalCreations[0]?.count || 0),
                plan: {
                    name: userPlan[0]?.plan || 'free',
                    expires: userPlan[0]?.plan_expires || null,
                    isActive: !userPlan[0]?.plan_expires || new Date(userPlan[0].plan_expires) > new Date()
                },
                recentCreations: recentCreations.map(creation => ({
                    ...creation,
                    likes: Array.isArray(creation.likes) ? creation.likes : []
                }))
            }
        };

        console.log('✅ Dashboard data prepared successfully');
        return res.json(response);

    } catch (error) {
        console.error('❌ Fatal error in getDashboardData:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            detail: error.detail,
            hint: error.hint
        });
        
        return res.status(500).json({
            success: false,
            message: 'Failed to load dashboard data',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            details: process.env.NODE_ENV === 'development' ? {
                code: error.code,
                detail: error.detail,
                hint: error.hint
            } : undefined
        });
    }
};