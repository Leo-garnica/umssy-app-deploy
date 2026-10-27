-- Catalogs required by Epic 2 NLP and Epic 3 radar/recruitment.
-- Definitions copied from upstream feature/epic-2-y-epic-3, merge 144e9be9:
-- modules/profile/constants/radar-areas.constants.ts
-- modules/skills/seeds/skills-catalog.seed.ts
-- modules/job-offers/seeds/job-offer-*-catalog.seed.ts
-- Inserts missing catalog entries and fills only missing skill area mappings.
-- Existing IDs, non-null mappings, custom flags and profile data are preserved.
-- No accounts, applications, documents or sample vacancies are created.

BEGIN;

INSERT INTO radar_areas (id, name, description, updated_at) VALUES
  ('desarrollo', 'Desarrollo de Software', 'Frontend, backend, mobile y arquitectura de software', now()),
  ('cloud-devops', 'Cloud & DevOps', 'Infraestructura en la nube, CI/CD, contenedores y automatización', now()),
  ('data-ai', 'Datos & IA', 'Bases de datos, analítica, pipelines de datos e inteligencia artificial', now()),
  ('qa', 'QA & Testing', 'Aseguramiento de la calidad, pruebas automatizadas y manuales', now()),
  ('ciberseguridad', 'Ciberseguridad', 'Seguridad informática, pentesting, auditoría y protección de datos', now()),
  ('gobernanza-ti', 'Gobernanza TI', 'Gestión de proyectos, metodologías ágiles, ITIL y liderazgo técnico', now())
ON CONFLICT DO NOTHING;

INSERT INTO skills (id, name, is_custom, area_id, updated_at)
SELECT gen_random_uuid(), catalog.name, false, catalog.area_id, now()
FROM (VALUES
  ('JavaScript', 'desarrollo'),
  ('TypeScript', 'desarrollo'),
  ('Java', 'desarrollo'),
  ('C++', 'desarrollo'),
  ('C#', 'desarrollo'),
  ('Go', 'desarrollo'),
  ('Rust', 'desarrollo'),
  ('PHP', 'desarrollo'),
  ('Ruby', 'desarrollo'),
  ('Kotlin', 'desarrollo'),
  ('Swift', 'desarrollo'),
  ('Dart', 'desarrollo'),
  ('Scala', 'desarrollo'),
  ('Assembly', 'desarrollo'),
  ('HTML5', 'desarrollo'),
  ('CSS3', 'desarrollo'),
  ('React', 'desarrollo'),
  ('React Native', 'desarrollo'),
  ('Angular', 'desarrollo'),
  ('Vue.js', 'desarrollo'),
  ('Next.js', 'desarrollo'),
  ('Node.js', 'desarrollo'),
  ('NestJS', 'desarrollo'),
  ('Express', 'desarrollo'),
  ('Django', 'desarrollo'),
  ('FastAPI', 'desarrollo'),
  ('Flask', 'desarrollo'),
  ('Spring Boot', 'desarrollo'),
  ('.NET', 'desarrollo'),
  ('Laravel', 'desarrollo'),
  ('Tailwind CSS', 'desarrollo'),
  ('Bootstrap', 'desarrollo'),
  ('jQuery', 'desarrollo'),
  ('Flutter', 'desarrollo'),
  ('Docker', 'cloud-devops'),
  ('Kubernetes', 'cloud-devops'),
  ('Git', 'cloud-devops'),
  ('GitHub', 'cloud-devops'),
  ('GitLab', 'cloud-devops'),
  ('Linux', 'cloud-devops'),
  ('AWS', 'cloud-devops'),
  ('Azure', 'cloud-devops'),
  ('Google Cloud', 'cloud-devops'),
  ('Terraform', 'cloud-devops'),
  ('Jenkins', 'cloud-devops'),
  ('CI/CD', 'cloud-devops'),
  ('Ansible', 'cloud-devops'),
  ('Nginx', 'cloud-devops'),
  ('Bash', 'cloud-devops'),
  ('Python', 'data-ai'),
  ('R', 'data-ai'),
  ('MATLAB', 'data-ai'),
  ('SQL', 'data-ai'),
  ('PostgreSQL', 'data-ai'),
  ('MySQL', 'data-ai'),
  ('MongoDB', 'data-ai'),
  ('Redis', 'data-ai'),
  ('SQLite', 'data-ai'),
  ('SQL Server', 'data-ai'),
  ('Oracle Database', 'data-ai'),
  ('Firebase', 'data-ai'),
  ('Elasticsearch', 'data-ai'),
  ('Machine Learning', 'data-ai'),
  ('Deep Learning', 'data-ai'),
  ('TensorFlow', 'data-ai'),
  ('PyTorch', 'data-ai'),
  ('Pandas', 'data-ai'),
  ('NumPy', 'data-ai'),
  ('Power BI', 'data-ai'),
  ('Tableau', 'data-ai'),
  ('Selenium', 'qa'),
  ('Cypress', 'qa'),
  ('Jest', 'qa'),
  ('JUnit', 'qa'),
  ('Postman', 'qa'),
  ('OWASP', 'ciberseguridad'),
  ('Pentesting', 'ciberseguridad'),
  ('Scrum', 'gobernanza-ti'),
  ('Kanban', 'gobernanza-ti'),
  ('ITIL', 'gobernanza-ti'),
  ('Jira', 'gobernanza-ti')
) AS catalog(name, area_id)
ON CONFLICT (name) DO UPDATE
SET area_id = EXCLUDED.area_id, updated_at = now()
WHERE skills.area_id IS NULL;

INSERT INTO job_offer_statuses (id, title, updated_at) VALUES
  (gen_random_uuid(), 'Borrador', now()),
  (gen_random_uuid(), 'Publicada', now()),
  (gen_random_uuid(), 'Pausada', now()),
  (gen_random_uuid(), 'Cerrada', now()),
  (gen_random_uuid(), 'Archivada', now())
ON CONFLICT DO NOTHING;

INSERT INTO job_offer_modalities (id, title, updated_at) VALUES
  (gen_random_uuid(), 'Presencial', now()),
  (gen_random_uuid(), 'Remoto', now()),
  (gen_random_uuid(), 'Híbrido', now())
ON CONFLICT DO NOTHING;

INSERT INTO job_offer_contract_types (id, title, updated_at) VALUES
  (gen_random_uuid(), 'Tiempo completo', now()),
  (gen_random_uuid(), 'Medio tiempo', now()),
  (gen_random_uuid(), 'Pasantía', now())
ON CONFLICT DO NOTHING;

COMMIT;
