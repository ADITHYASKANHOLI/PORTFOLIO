import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { Project, SiteContentMap, SectionKey, Skill, SocialLink } from '@/types';
import { INITIAL_PROJECTS, INITIAL_SITE_CONTENT, INITIAL_SKILLS, INITIAL_SOCIALS } from './initialData';

// Local storage keys for resilient fallback / mock development
const STORAGE_KEYS = {
  PROJECTS: 'kanholi_portfolio_projects',
  CONTENT: 'kanholi_portfolio_content',
  SKILLS: 'kanholi_portfolio_skills',
  SOCIALS: 'kanholi_portfolio_socials',
};

// Helpers for localStorage fallback
function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return defaultValue;
    return JSON.parse(saved) as T;
  } catch {
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Failed to save to localStorage:', err);
  }
}

// ----------------------------------------------------------------------
// PROJECTS API
// ----------------------------------------------------------------------

export async function fetchProjects(includeDrafts: boolean = false): Promise<Project[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (!includeDrafts) {
        query = query.eq('published', true);
      }

      const { data, error } = await query;
      if (error) {
        console.warn('Supabase fetchProjects error, falling back to local cache:', error.message);
      } else if (data && data.length > 0) {
        return data as Project[];
      }
    } catch (err) {
      console.warn('Failed to fetch projects from Supabase:', err);
    }
  }

  // Fallback / offline mode
  const local = getLocalItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  if (!includeDrafts) {
    return local.filter((p) => p.published);
  }
  return local.sort((a, b) => a.display_order - b.display_order);
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        return data as Project;
      }
    } catch (err) {
      console.warn('Failed to fetch project by slug from Supabase:', err);
    }
  }

  const local = getLocalItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  return local.find((p) => p.slug === slug) || null;
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return data as Project;
      }
    } catch (err) {
      console.warn('Failed to fetch project by id from Supabase:', err);
    }
  }

  const local = getLocalItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  return local.find((p) => p.id === id) || null;
}

export async function saveProject(project: Partial<Project>): Promise<Project> {
  const isNew = !project.id;
  const now = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    try {
      if (isNew) {
        const { data, error } = await supabase
          .from('projects')
          .insert({
            title: project.title,
            slug: project.slug,
            short_description: project.short_description || '',
            full_description: project.full_description || '',
            cover_image_path: project.cover_image_path || null,
            gallery: project.gallery || [],
            category: project.category || 'Software & Systems',
            technologies: project.technologies || [],
            github_url: project.github_url || null,
            demo_url: project.demo_url || null,
            external_url: project.external_url || null,
            project_date: project.project_date || new Date().toISOString().slice(0, 10),
            featured: project.featured ?? false,
            display_order: project.display_order ?? 0,
            published: project.published ?? false,
          })
          .select()
          .single();

        if (error) throw error;
        return data as Project;
      } else {
        const { data, error } = await supabase
          .from('projects')
          .update({
            title: project.title,
            slug: project.slug,
            short_description: project.short_description,
            full_description: project.full_description,
            cover_image_path: project.cover_image_path,
            gallery: project.gallery,
            category: project.category,
            technologies: project.technologies,
            github_url: project.github_url,
            demo_url: project.demo_url,
            external_url: project.external_url,
            project_date: project.project_date,
            featured: project.featured,
            display_order: project.display_order,
            published: project.published,
            updated_at: now,
          })
          .eq('id', project.id)
          .select()
          .single();

        if (error) throw error;
        return data as Project;
      }
    } catch (err) {
      console.warn('Supabase saveProject error, writing to local storage fallback:', err);
    }
  }

  // Fallback local update
  const localProjects = getLocalItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  if (isNew) {
    const newProj: Project = {
      id: `p-${Date.now()}`,
      title: project.title || 'Untitled Project',
      slug: project.slug || `project-${Date.now()}`,
      short_description: project.short_description || '',
      full_description: project.full_description || '',
      cover_image_path: project.cover_image_path || null,
      gallery: project.gallery || [],
      category: project.category || 'Software & Systems',
      technologies: project.technologies || [],
      github_url: project.github_url || null,
      demo_url: project.demo_url || null,
      external_url: project.external_url || null,
      project_date: project.project_date || new Date().toISOString().slice(0, 10),
      featured: project.featured ?? false,
      display_order: project.display_order ?? (localProjects.length + 1),
      published: project.published ?? false,
      created_at: now,
      updated_at: now,
    };
    localProjects.push(newProj);
    setLocalItem(STORAGE_KEYS.PROJECTS, localProjects);
    return newProj;
  } else {
    const index = localProjects.findIndex((p) => p.id === project.id);
    if (index === -1) throw new Error('Project not found');
    const updatedProj: Project = {
      ...localProjects[index],
      ...project,
      updated_at: now,
    } as Project;
    localProjects[index] = updatedProj;
    setLocalItem(STORAGE_KEYS.PROJECTS, localProjects);
    return updatedProj;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase deleteProject error:', err);
    }
  }

  const localProjects = getLocalItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  const filtered = localProjects.filter((p) => p.id !== id);
  setLocalItem(STORAGE_KEYS.PROJECTS, filtered);
  return true;
}

export async function toggleProjectPublish(id: string, published: boolean): Promise<Project> {
  return saveProject({ id, published });
}

export async function toggleProjectFeatured(id: string, featured: boolean): Promise<Project> {
  return saveProject({ id, featured });
}

// ----------------------------------------------------------------------
// SITE CONTENT API
// ----------------------------------------------------------------------

export async function fetchAllSiteContent(): Promise<SiteContentMap> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('site_content').select('*');
      if (!error && data && data.length > 0) {
        const merged = { ...INITIAL_SITE_CONTENT };
        for (const row of data) {
          const key = row.section_key as SectionKey;
          if (key && row.content) {
            merged[key] = { ...merged[key], ...row.content };
          }
        }
        return merged;
      }
    } catch (err) {
      console.warn('Supabase fetchAllSiteContent error, falling back to local:', err);
    }
  }

  return getLocalItem<SiteContentMap>(STORAGE_KEYS.CONTENT, INITIAL_SITE_CONTENT);
}

export async function fetchSiteContent<K extends SectionKey>(sectionKey: K): Promise<SiteContentMap[K]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', sectionKey)
        .single();

      if (!error && data && data.content) {
        return {
          ...INITIAL_SITE_CONTENT[sectionKey],
          ...data.content,
        };
      }
    } catch (err) {
      console.warn(`Supabase fetchSiteContent(${sectionKey}) error:`, err);
    }
  }

  const all = getLocalItem<SiteContentMap>(STORAGE_KEYS.CONTENT, INITIAL_SITE_CONTENT);
  return all[sectionKey] || INITIAL_SITE_CONTENT[sectionKey];
}

export async function updateSiteContent<K extends SectionKey>(
  sectionKey: K,
  content: Partial<SiteContentMap[K]>
): Promise<SiteContentMap[K]> {
  const current = await fetchSiteContent(sectionKey);
  const updated = { ...current, ...content };

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert(
          {
            section_key: sectionKey,
            content: updated,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'section_key' }
        );

      if (error) throw error;
    } catch (err) {
      console.warn(`Supabase updateSiteContent(${sectionKey}) error:`, err);
    }
  }

  // Update local fallback
  const all = getLocalItem<SiteContentMap>(STORAGE_KEYS.CONTENT, INITIAL_SITE_CONTENT);
  all[sectionKey] = updated as any;
  setLocalItem(STORAGE_KEYS.CONTENT, all);

  return updated;
}

// ----------------------------------------------------------------------
// SKILLS API
// ----------------------------------------------------------------------

export async function fetchSkills(): Promise<Skill[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Skill[];
      }
    } catch (err) {
      console.warn('Supabase fetchSkills error:', err);
    }
  }

  return getLocalItem<Skill[]>(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
}

export async function saveSkill(skill: Partial<Skill>): Promise<Skill> {
  const isNew = !skill.id;

  if (isSupabaseConfigured && supabase) {
    try {
      if (isNew) {
        const { data, error } = await supabase
          .from('skills')
          .insert({
            name: skill.name,
            category: skill.category || 'General',
            display_order: skill.display_order ?? 0,
          })
          .select()
          .single();

        if (error) throw error;
        return data as Skill;
      } else {
        const { data, error } = await supabase
          .from('skills')
          .update({
            name: skill.name,
            category: skill.category,
            display_order: skill.display_order,
          })
          .eq('id', skill.id)
          .select()
          .single();

        if (error) throw error;
        return data as Skill;
      }
    } catch (err) {
      console.warn('Supabase saveSkill error:', err);
    }
  }

  const local = getLocalItem<Skill[]>(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
  if (isNew) {
    const newSkill: Skill = {
      id: `s-${Date.now()}`,
      name: skill.name || 'New Skill',
      category: skill.category || 'Programming',
      display_order: skill.display_order ?? (local.length + 1),
    };
    local.push(newSkill);
    setLocalItem(STORAGE_KEYS.SKILLS, local);
    return newSkill;
  } else {
    const idx = local.findIndex((s) => s.id === skill.id);
    if (idx === -1) throw new Error('Skill not found');
    const updated = { ...local[idx], ...skill };
    local[idx] = updated;
    setLocalItem(STORAGE_KEYS.SKILLS, local);
    return updated;
  }
}

export async function deleteSkill(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase deleteSkill error:', err);
    }
  }

  const local = getLocalItem<Skill[]>(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
  const filtered = local.filter((s) => s.id !== id);
  setLocalItem(STORAGE_KEYS.SKILLS, filtered);
  return true;
}

// ----------------------------------------------------------------------
// SOCIAL LINKS API
// ----------------------------------------------------------------------

export async function fetchSocialLinks(enabledOnly: boolean = true): Promise<SocialLink[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from('social_links')
        .select('*')
        .order('display_order', { ascending: true });

      if (enabledOnly) {
        query = query.eq('enabled', true);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as SocialLink[];
      }
    } catch (err) {
      console.warn('Supabase fetchSocialLinks error:', err);
    }
  }

  const local = getLocalItem<SocialLink[]>(STORAGE_KEYS.SOCIALS, INITIAL_SOCIALS);
  if (enabledOnly) {
    return local.filter((s) => s.enabled);
  }
  return local;
}

export async function saveSocialLink(social: Partial<SocialLink>): Promise<SocialLink> {
  const isNew = !social.id;

  if (isSupabaseConfigured && supabase) {
    try {
      if (isNew) {
        const { data, error } = await supabase
          .from('social_links')
          .insert({
            platform: social.platform,
            url: social.url,
            display_order: social.display_order ?? 0,
            enabled: social.enabled ?? true,
          })
          .select()
          .single();

        if (error) throw error;
        return data as SocialLink;
      } else {
        const { data, error } = await supabase
          .from('social_links')
          .update({
            platform: social.platform,
            url: social.url,
            display_order: social.display_order,
            enabled: social.enabled,
          })
          .eq('id', social.id)
          .select()
          .single();

        if (error) throw error;
        return data as SocialLink;
      }
    } catch (err) {
      console.warn('Supabase saveSocialLink error:', err);
    }
  }

  const local = getLocalItem<SocialLink[]>(STORAGE_KEYS.SOCIALS, INITIAL_SOCIALS);
  if (isNew) {
    const newSocial: SocialLink = {
      id: `soc-${Date.now()}`,
      platform: social.platform || 'Platform',
      url: social.url || 'https://',
      display_order: social.display_order ?? (local.length + 1),
      enabled: social.enabled ?? true,
    };
    local.push(newSocial);
    setLocalItem(STORAGE_KEYS.SOCIALS, local);
    return newSocial;
  } else {
    const idx = local.findIndex((s) => s.id === social.id);
    if (idx === -1) throw new Error('Social link not found');
    const updated = { ...local[idx], ...social };
    local[idx] = updated;
    setLocalItem(STORAGE_KEYS.SOCIALS, local);
    return updated;
  }
}

export async function deleteSocialLink(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('social_links').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase deleteSocialLink error:', err);
    }
  }

  const local = getLocalItem<SocialLink[]>(STORAGE_KEYS.SOCIALS, INITIAL_SOCIALS);
  const filtered = local.filter((s) => s.id !== id);
  setLocalItem(STORAGE_KEYS.SOCIALS, filtered);
  return true;
}

// ----------------------------------------------------------------------
// STORAGE & MEDIA API
// ----------------------------------------------------------------------

export async function uploadMediaFile(
  file: File,
  folder: string = 'general'
): Promise<{ path: string; publicUrl: string }> {
  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'image/avif'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Unsupported image format. Please upload JPEG, PNG, WebP, AVIF, or SVG.');
  }

  // Validate size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image size must be less than 5MB.');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  if (isSupabaseConfigured && supabase) {
    const { error: uploadError } = await supabase.storage
      .from('portfolio-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from('portfolio-media')
      .getPublicUrl(filePath);

    return {
      path: filePath,
      publicUrl: publicUrlData.publicUrl,
    };
  }

  // Fallback for offline / demo mode: create an Object URL or data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        path: filePath,
        publicUrl: reader.result as string,
      });
    };
    reader.onerror = () => reject(new Error('Failed to read file locally.'));
    reader.readAsDataURL(file);
  });
}

export async function deleteMediaFile(pathOrUrl: string): Promise<boolean> {
  if (!pathOrUrl) return false;
  if (!isSupabaseConfigured || !supabase) return true;

  try {
    let cleanPath = pathOrUrl;
    if (cleanPath.includes('/portfolio-media/')) {
      cleanPath = cleanPath.split('/portfolio-media/')[1];
    }
    const { error } = await supabase.storage.from('portfolio-media').remove([cleanPath]);
    if (error) {
      console.warn('Failed to delete media from storage:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('deleteMediaFile error:', err);
    return false;
  }
}

export function getStoragePublicUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  if (isSupabaseConfigured && supabase) {
    const { data } = supabase.storage.from('portfolio-media').getPublicUrl(path);
    return data.publicUrl;
  }
  return path;
}

// ----------------------------------------------------------------------
// AUTHORIZATION HELPER
// ----------------------------------------------------------------------

export async function checkIsAdmin(userId: string): Promise<boolean> {
  if (!userId) return false;
  if (!isSupabaseConfigured || !supabase) {
    // In local / demo mode without Supabase, allow access so user can test the admin panel
    return true;
  }

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Error checking admin role in Supabase:', error.message);
      return false;
    }
    return Boolean(data);
  } catch (err) {
    console.warn('Failed to verify admin status:', err);
    return false;
  }
}

