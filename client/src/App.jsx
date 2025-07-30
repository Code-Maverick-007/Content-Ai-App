import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './pages/Layout';
import DashBoard from './pages/DashBoard';
import Writearticle from './pages/WriteArticle';
import BolgTitles from './pages/BolgTitles';
import GenerateImages from './pages/GenerateImages';
import RemoveBackground from './pages/RemoveBackground';
import RemoveObject from './pages/RemoveObject';
import ReviewResume from "./pages/ReviewResume";
import Community from './pages/community';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ai" element={<Layout />}>
        <Route index element={<DashBoard />} />
        <Route path="write-article" element={<Writearticle />} />
        <Route path="blog-titles" element={<BolgTitles />} />
        <Route path="generate-images" element={<GenerateImages />} />
        <Route path="remove-background" element={<RemoveBackground />} />
        <Route path="remove-object" element={<RemoveObject />} />
        <Route path="reviwe-resume" element={<ReviewResume />} />
        <Route path="community" element={<Community />} />
      </Route>
    </Routes>
  );
};

export default App;
