import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ArticleDisplay from '../../component/ArticleComponents/ArticleDisplay'


const endpoint = process.env.DEV_MODE === "true" ? process.env.LOCALHOST : ""

async function getArticle(slug: string) {
    try {
        const res = await fetch(`https://www.outread.ai/api/getArticle?slug=${slug}`, { cache: 'no-store' })
        if (!res.ok) {
            throw new Error('Failed to fetch article')
        }
        return res.json()
    } catch (error) {
        console.error('Error fetching article:', error)
        return null
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const article = await getArticle(params.slug)
    if (!article) {
        return {
            title: 'Article Not Found',
            description: 'The requested article could not be found.',
        }
    }
    return {
        title: article.title,
        description: article.subtitle,
    }
}

const compare = {
    "id": "cmcbdsuvwgfdivue83oruojklf",
    "imageId": "cm1qgpx3v000134ft0ykfjg4f",
    "doi": "10.1142/S0219525918500145",
    "audioId": null,
    "originalPaperTitle": "TALENT VERSUS LUCK: THE ROLE OF RANDOMNESS IN SUCCESS AND FAILURE",
    "authorName": "ALESSANDRO PLUCHINO",
    "slug": "talent-versus-luck",
    "title": "Talent Versus Luck",
    "subtitle": "How much does randomness influence career achievements?",
    "altMetricScore": 4068,
    "simpleSummary": [
        {
            "content": "• A new agent-based model reveals how luck plays a bigger role than talent in shaping success, challenging our views on meritocracy.\n\n• Simulations show that the most successful people are often those with average talent but fortunate circumstances, not necessarily the most skilled.\n\n• Rewarding past success as a measure of talent may perpetuate inequality by amplifying the advantages of the lucky few.\n\n• Random funding allocation might outperform merit-based systems in fostering genuine talent by embracing serendipity.\n\n• The article highlights how creating environments that nurture chance encounters can unlock the full potential of talented individuals.",
            "heading": "How luck, not merit, shapes success: The surprising power of serendipity"
        },
        {
            "content": "In our highly competitive world, we often attribute success solely to talent, intelligence, and hard work. However, this paper challenges that notion by exploring the underestimated role of luck and randomness in shaping successful careers. Through an agent-based model, the authors demonstrate that while talent is necessary, it is rarely sufficient for achieving extraordinary success. Instead, averagely talented individuals who are blessed with fortuitous opportunities often surpass their more gifted counterparts.",
            "heading": "The Serendipitous Path to Success"
        },
        {
            "content": "The model reveals a striking paradox: while talent follows a normal distribution, the resulting distribution of wealth and success follows a power law, with a vast gap between the rich and the poor. Surprisingly, the most successful individuals are seldom the most talented ones. Rather, they are often those with moderate talents who have been favored by serendipitous events and lucky breaks.",
            "heading": "The Paradox of Talent and Wealth"
        },
        {
            "content": "The findings challenge the notion of 'naive meritocracy,' where rewards and resources are allocated based solely on perceived success, mistakenly equating it with talent. This approach inadvertently reinforces the success of the luckiest individuals, while overlooking the truly talented who may have been hindered by unfortunate circumstances. The authors argue for a more nuanced approach that accounts for the role of randomness in shaping outcomes.",
            "heading": "Challenging Naive Meritocracy"
        },
        {
            "content": "The paper explores various strategies for counterbalancing the effects of luck and fostering the success of the most talented individuals. Surprisingly, egalitarian distribution of resources and random selection prove more effective than traditional 'meritocratic' approaches that favor the already successful. The authors also highlight the importance of a stimulating environment and educational opportunities in unlocking the potential of the gifted.",
            "heading": "Strategies for Nurturing Talent"
        },
        {
            "content": "Ultimately, the authors advocate for embracing serendipity and fostering diversity in research and innovation. By recognizing the role of chance discoveries and supporting a diverse range of ideas and perspectives, we can create an environment where true talent can thrive and contribute to the collective progress of society.",
            "heading": "Embracing Serendipity and Diversity"
        }
    ],
    "defaultSummary": [
        {
            "heading": "The Deceptive Dance of Talent and Fortune",
            "content": "Using an agent-based model called 'Talent vs Luck' (TvL), researchers demonstrated that success is governed more by random events than commonly believed. The model simulated 1000 agents with normally distributed talent over a 40-year career span, exposing them to both lucky and unlucky events. Surprisingly, the most successful individuals were not the most talented, but rather those with average abilities who encountered fortunate circumstances."
        },
        {
            "heading": "When Lightning Strikes: The Mathematics of Success",
            "content": "While talent followed a normal (Gaussian) distribution in the population, the resulting success/wealth distribution exhibited a power law pattern matching the real-world Pareto '80-20' rule. The simulations revealed that the most successful individual had only slightly above-average talent (T=0.61) but accumulated 128 times more capital than the average of people more talented than them. This mathematical mismatch between input (talent) and output (success) pointed to luck as the hidden factor."
        },
        {
            "heading": "The Fallacy of 'Naive Meritocracy'",
            "content": "The study challenges what researchers term 'naive meritocracy' - the practice of rewarding people based on their past success, mistakenly assumed to directly reflect their talent. This approach creates a rich-get-richer feedback loop that amplifies initial lucky breaks while potentially neglecting highly talented individuals who experienced early misfortune. The findings suggest that many talented individuals remain undiscovered and underutilized due to this systemic bias."
        },
        {
            "heading": "Rethinking Resource Distribution",
            "content": "When testing different funding strategies, the research found that distributing resources equally among all participants was more effective than concentrating them among the previously successful few. Counter-intuitively, even random allocation of resources proved more efficient than merit-based distribution in fostering talent. This suggests that current funding models in areas like scientific research may be systematically underperforming by overly focusing on past success."
        },
        {
            "heading": "The Environmental Factor",
            "content": "The study explored how environmental conditions impact success rates. In simulated environments rich with opportunities (80% lucky events), about 62% of talented individuals achieved success. However, in opportunity-poor environments (20% lucky events), only 8.75% of talented individuals succeeded. This dramatic difference highlights how external circumstances, often determined by factors like birthplace or socioeconomic background, can overwhelm individual talent."
        },
        {
            "heading": "Implications for Policy and Progress",
            "content": "The research suggests that maximizing societal progress requires fundamentally rethinking how we allocate opportunities and resources. Rather than concentrating support on those already successful, a more effective approach would be creating environments rich in opportunities and ensuring broader access to resources. This would increase the chances of talented individuals encountering the lucky breaks necessary for success, ultimately benefiting society through greater innovation and achievement."
        }
    ],
    "oneCardSummary": {
        "content": "• A new agent-based model reveals how luck plays a bigger role than talent in shaping success, challenging our views on meritocracy.\n\n• Simulations show that the most successful people are often those with average talent but fortunate circumstances, not necessarily the most skilled.\n\n• Rewarding past success as a measure of talent may perpetuate inequality by amplifying the advantages of the lucky few.\n\n• Random funding allocation might outperform merit-based systems in fostering genuine talent by embracing serendipity.\n\n• The article highlights how creating environments that nurture chance encounters can unlock the full potential of talented individuals.",
        "heading": "How luck, not merit, shapes success: The surprising power of serendipity"
    },
    "estimatedReadingTime": 9,
    "favouritedCount": 0,
    "createdAt": "2024-10-01T13:21:28.156Z",
    "updatedAt": "2024-10-01T13:21:28.156Z",
    "generatedWith": "TEXT_CONTENT",
    "articleImage": {
        "id": "cm1qgpx3v000134ft0ykfjg4f",
        "src": "https://cnducrozrpvuuztqkxhz.supabase.co/storage/v1/object/public/Images/article_covers/Talent%20Versus%20Luck.png",
        "name": "Talent Versus Luck.png",
        "alt": "Talent Versus Luck.png"
    },
    "categories": [
        {
            "id": "cm17z39260003jom9so3lq9kz",
            "name": "Social Science"
        },
        {
            "id": "cm17z6vdk0008jom93khtn71w",
            "name": "Featured"
        }
    ],
    "coverImage": "https://cnducrozrpvuuztqkxhz.supabase.co/storage/v1/object/public/Images/article_covers/Talent%20Versus%20Luck.png"
}





export default async function ArticlePage({ params }: { params: { slug: string } }) {
    const article = await getArticle(params.slug)

    if (!article) {
        <ArticleDisplay article={compare as any} />
        // notFound()
    }

    return <ArticleDisplay article={article} />
}