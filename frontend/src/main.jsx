import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/api.js';
import './index.css'
import App from './App.jsx'
import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Dashboard from "./pages/dashboard.jsx";
import ProjectLayout from "./pages/project/ProjectLayout.jsx";
import ProjectHome from "./pages/project/ProjectHome.jsx";
import CharacterRoster from "./pages/project/CharacterRoster.jsx";
import CharacterProfile from "./pages/project/CharacterProfile.jsx";
import WorldDetail from "./pages/project/WorldDetail.jsx";
import StoryLayout from "./pages/project/story/StoryLayout.jsx";
import StoryHome from "./pages/project/story/StoryHome.jsx";
import ChapterEditor from "./pages/project/story/ChapterEditor.jsx";
import SceneEditor from "./pages/project/story/SceneEditor.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project/:projectId" element={<ProjectLayout />}>
            <Route index element={<ProjectHome />} />
            <Route path="story/:storyId" element={<StoryLayout />}>
              <Route index element={<StoryHome />} />
              <Route path="chapter/:chapterId" element={<ChapterEditor />} />
              <Route path="chapter/:chapterId/scene/:sceneId" element={<SceneEditor />} />
            </Route>
            <Route path="characters" element={<CharacterRoster />} />
            <Route path="characters/:characterId" element={<CharacterProfile />} />
            <Route path="world/:worldId" element={<WorldDetail />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
