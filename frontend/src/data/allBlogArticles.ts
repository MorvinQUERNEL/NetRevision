import { blogArticles as original } from './blogArticles'
import { blogArticlesDaily1 } from './blogArticlesDaily1'
import { blogArticlesDaily2 } from './blogArticlesDaily2'
import { blogArticlesDaily3 } from './blogArticlesDaily3'
import { blogArticlesDaily4 } from './blogArticlesDaily4'
import { blogArticlesDaily5 } from './blogArticlesDaily5'
import { blogArticlesDaily6 } from './blogArticlesDaily6'
import { blogArticlesDaily7 } from './blogArticlesDaily7'
import { blogArticlesDaily8 } from './blogArticlesDaily8'
import { blogArticlesDaily9 } from './blogArticlesDaily9'
import { blogArticlesDaily10 } from './blogArticlesDaily10'

export type { BlogArticle, ArticleSection } from './blogArticles'

export const blogArticles = [
  ...original,
  ...blogArticlesDaily1,
  ...blogArticlesDaily2,
  ...blogArticlesDaily3,
  ...blogArticlesDaily4,
  ...blogArticlesDaily5,
  ...blogArticlesDaily6,
  ...blogArticlesDaily7,
  ...blogArticlesDaily8,
  ...blogArticlesDaily9,
  ...blogArticlesDaily10,
]
