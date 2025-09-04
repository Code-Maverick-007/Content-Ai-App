import { v2 as cloudinary } from 'cloudinary';

/**
 * Configures and verifies the Cloudinary connection
 * @returns {Promise<boolean>} Returns true if configuration is successful
 */
const cloudinaryConfig = async () => {
  try {
    // Check for required environment variables
    const requiredEnvVars = [
      'CLOUDINARY_CLOUD_NAME',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Missing required Cloudinary environment variables: ${missingVars.join(', ')}`);
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true // Always use HTTPS
    });

    // Test the configuration by making a simple API call
    const result = await cloudinary.api.ping();
    
    if (result.status !== 'ok') {
      throw new Error('Failed to verify Cloudinary configuration');
    }

    console.log('Cloudinary configured successfully');
    return true;
  } catch (error) {
    console.error('Failed to configure Cloudinary:', error);
    throw error; // Re-throw to allow the calling code to handle the error
  }
};

export default cloudinaryConfig;
