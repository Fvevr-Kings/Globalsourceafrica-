import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { MonoLabel } from "@/components/v2/MonoLabel";
import { ARTICLES, getArticle } from "@/lib/v2/articles";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const a = getArticle(params.slug);
  if (!a) return { title: "Resource — GlobalSource Africa" };
  return { title: `${a.title} — GlobalSource Africa`, description: a.excerpt };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  return (
    <>
      <section className="gsa-corrugation bg-navy text-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <Link href="/resources" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white">
            <ChevronLeft className="h-4 w-4" /> Resources
          </Link>
          <MonoLabel className="mt-4 block text-container">GUIDE · {article.readMins} MIN READ</MonoLabel>
          <h1 className="gsa-heading mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-4 text-lg text-white/70">{article.excerpt}</p>
        </div>
      </section>

      <section className="bg-white">
        <article className="mx-auto max-w-3xl px-4 py-14">
          {article.body.map((sec) => (
            <div key={sec.heading} className="mt-8 first:mt-0">
              <h2 className="gsa-heading text-xl font-bold text-navy">{sec.heading}</h2>
              {sec.paragraphs.map((p, i) => (
                <p key={i} className="mt-3 leading-relaxed text-navy/80">{p}</p>
              ))}
            </div>
          ))}

          <div className="mt-14 rounded-2xl bg-navy p-8 text-center text-white">
            <h2 className="gsa-heading text-2xl font-bold">Put this into practice</h2>
            <p className="mx-auto mt-2 max-w-md text-white/70">
              Have us verify a supplier or source for you — flat fee, 48-hour reply.
            </p>
            <Link href="/request" className="mt-5 inline-flex items-center gap-2 rounded-full bg-container px-6 py-3 font-semibold text-white hover:bg-container/90">
              Make a request <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </article>
      </section>
    </>
  );
}
