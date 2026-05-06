import type { ArticleSeed } from './types';
import { infraDevopsArticles } from './infra-devops';
import { securityArticles } from './security';
import { engineeringBasicsArticles } from './engineering-basics';
import { aiAdvancedArticles } from './ai-advanced';
import { careerArticles } from './career';

export const articles: ArticleSeed[] = [
  ...infraDevopsArticles,
  ...securityArticles,
  ...engineeringBasicsArticles,
  ...aiAdvancedArticles,
  ...careerArticles,
];
