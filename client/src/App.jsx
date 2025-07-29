import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './pages/Layout';
import DashBoard from './pages/DashBoard';
import Writeartical from './pages/Writeartical';
import BolgTitles from './pages/BolgTitles';
import GenerateImages from './pages/GenerateImages';
import RemoveBackground from './pages/RemoveBackground';
import RemoveObject from './pages/RemoveObject';
import ReviweResume from './pages/ReviweResume';
import Community from './pages/community';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ai" element={<Layout />}>
        <Route index element={<DashBoard />} />
        <Route path="write-artical" element={<Writeartical />} />
        <Route path="blog-titles" element={<BolgTitles />} />
        <Route path="generate-images" element={<GenerateImages />} />
        <Route path="remove-background" element={<RemoveBackground />} />
        <Route path="remove-object" element={<RemoveObject />} />
        <Route path="review-resume" element={<ReviweResume />} />
        <Route path="community" element={<Community />} />
      </Route>
    </Routes>
  );
};

export default App;
