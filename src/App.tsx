import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LiquidGlassFilter } from '@zakisheriff/liquid-glass';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { AppPreloader } from '@/components/AppPreloader';
import { PageCurtainTransition } from '@/animations/PageCurtainTransition';

// Public Pages
import { HomePage } from '@/pages/HomePage';
import { ProjectDetailPage } from '@/pages/ProjectDetailPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Admin CMS
import { LoginPage } from '@/pages/admin/LoginPage';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { ProjectsListPage } from '@/pages/admin/ProjectsListPage';
import { ProjectFormPage } from '@/pages/admin/ProjectFormPage';
import { ContentManagerPage } from '@/pages/admin/ContentManagerPage';
import { SkillsManagerPage } from '@/pages/admin/SkillsManagerPage';
import { SocialsManagerPage } from '@/pages/admin/SocialsManagerPage';
import { MediaManagerPage } from '@/pages/admin/MediaManagerPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppPreloader>
        <LiquidGlassFilter>
          <BrowserRouter>
            <PageCurtainTransition>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/project/:slug" element={<ProjectDetailPage />} />

                {/* Admin Login */}
                <Route path="/admin/login" element={<LoginPage />} />

                {/* Protected Admin CMS Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminGuard>
                      <AdminLayout />
                    </AdminGuard>
                  }
                >
                  <Route index element={<DashboardPage />} />
                  <Route path="projects" element={<ProjectsListPage />} />
                  <Route path="projects/new" element={<ProjectFormPage />} />
                  <Route path="projects/edit/:id" element={<ProjectFormPage />} />
                  <Route path="content" element={<ContentManagerPage />} />
                  <Route path="skills" element={<SkillsManagerPage />} />
                  <Route path="socials" element={<SocialsManagerPage />} />
                  <Route path="media" element={<MediaManagerPage />} />
                </Route>

                {/* Fallback 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </PageCurtainTransition>
          </BrowserRouter>
        </LiquidGlassFilter>
      </AppPreloader>
    </AuthProvider>
  );
};

export default App;
