// Launch resource articles (SEO engine). Every article proves why GSA exists.
// Body is structured sections so the article template stays simple.

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  readMins: number;
  body: { heading: string; paragraphs: string[] }[];
};

export const ARTICLES: Article[] = [
  {
    slug: "verify-african-supplier-before-deposit",
    title: "How to verify an African supplier before paying a deposit",
    excerpt: "The five checks that separate a real exporter from a costly mistake — and how to run them before any money moves.",
    readMins: 6,
    body: [
      { heading: "Why the deposit is the danger point", paragraphs: [
        "Most losses in Africa trade happen at the deposit. A supplier looks legitimate over email, sends convincing documents, asks for 30% upfront — and then goes quiet. By the time you realise, the money has moved through several accounts and is gone.",
        "The fix is not more emails. It is independent confirmation, on the ground, before you transfer anything.",
      ]},
      { heading: "1. Confirm the legal entity exists", paragraphs: [
        "Every serious exporter is a registered company. Ask for the registration number and check it against the national registry — in Ghana, the Registrar-General's Department. Confirm the company is active, and that the directors and address match what the supplier told you.",
      ]},
      { heading: "2. Verify the export license", paragraphs: [
        "Selling domestically and exporting are different permissions. Confirm the supplier actually holds a valid export license for the product, plus any product-specific certification (phytosanitary, organic, fair-trade) they claim.",
      ]},
      { heading: "3. Put eyes on the site", paragraphs: [
        "A photo proves nothing — it can be lifted from anywhere. A dated visit, video walk-through or third-party audit of the warehouse and processing line proves the operation is real and has the capacity claimed.",
      ]},
      { heading: "4. Call references and trade history", paragraphs: [
        "Ask for prior buyers and actually call them. A supplier who has shipped internationally before will have a paper trail — bills of lading, past invoices — that a first-time fraudster cannot fabricate on demand.",
      ]},
      { heading: "5. Get a written risk rating", paragraphs: [
        "Pull it together into a decision-ready view: what checked out, what didn't, and a clear recommendation. That is exactly the deliverable of a verification report — and it is far cheaper than a lost deposit.",
      ]},
    ],
  },
  {
    slug: "why-africa-shipments-rejected-eu",
    title: "Why shipments from Africa get rejected in the EU (and how to prevent it)",
    excerpt: "Rejections are rarely about the goods themselves — they're about documentation, contaminants and inspection gaps you can close in advance.",
    readMins: 5,
    body: [
      { heading: "Rejections are usually preventable", paragraphs: [
        "A rejected container at an EU port is expensive: demurrage, re-export or destruction costs, and a blown customer commitment. The frustrating part is that most rejections trace back to issues that were visible before loading.",
      ]},
      { heading: "The three common causes", paragraphs: [
        "Documentation mismatches — certificates that don't match the shipment, missing phytosanitary paperwork, or an EORI/importer detail wrong on the bill of lading.",
        "Contaminants and residues — aflatoxins in nuts and spices, pesticide residues above EU MRLs, or moisture that triggers mould in transit.",
        "Inspection gaps — no independent check at sampling or loading, so a quality problem only surfaces on arrival.",
      ]},
      { heading: "How to prevent it", paragraphs: [
        "Agree the exact EU requirements in the contract, not after. Coordinate accredited testing (SGS, Cotecna) at sampling for the specific residues and contaminants that apply to your product. Inspect at loading so the container that sails is the one you approved.",
        "Prevention costs a fraction of a rejection. It is the whole reason inspection coordination exists.",
      ]},
    ],
  },
  {
    slug: "africa-export-documentation-buyers-guide",
    title: "Export documentation: what buyers should ask for",
    excerpt: "A plain-English checklist of the documents a legitimate African exporter can produce — and what each one proves.",
    readMins: 5,
    body: [
      { heading: "Documents are proof, not paperwork", paragraphs: [
        "Each export document exists to prove something specific. Knowing what each one confirms lets you spot a supplier who is improvising versus one who genuinely exports.",
      ]},
      { heading: "The core set", paragraphs: [
        "Certificate of incorporation / commercial register — proves the company legally exists.",
        "Export license — proves they're permitted to ship the product abroad.",
        "Commercial invoice & packing list — the contract detail: goods, quantity, value, terms.",
        "Bill of Lading — proves goods were handed to the carrier; your key title document.",
        "Certificate of Origin — confirms where the goods were produced (and can affect duty).",
        "Phytosanitary / quality certificates — required for agricultural products into most markets.",
      ]},
      { heading: "How to use the list", paragraphs: [
        "Ask for samples of these documents from a past shipment early in the conversation. A real exporter produces them without friction. Hesitation, excuses or 'we'll send it after the deposit' is a red flag worth acting on.",
      ]},
    ],
  },
  {
    slug: "shea-sourcing-guide-grades-quality",
    title: "Shea sourcing guide: grades, quality and what to verify",
    excerpt: "Ghana is a leading shea origin. Here's how grades work, what quality metrics matter, and what to confirm before you buy.",
    readMins: 6,
    body: [
      { heading: "Why Ghana for shea", paragraphs: [
        "Northern Ghana sits in the shea belt and has a long, organised export history for both raw nuts and processed butter. That maturity means real cooperatives, established graders and exporters who understand international buyers.",
      ]},
      { heading: "Grades and what they mean", paragraphs: [
        "Raw shea nuts are graded on moisture, free fatty acid (FFA) levels and foreign matter. Butter is graded (commonly A–E) on colour, odour, purity and FFA. Cosmetic buyers usually want Grade A unrefined; soap and industrial buyers can accept lower grades at lower cost.",
      ]},
      { heading: "What to verify before buying", paragraphs: [
        "Confirm FFA and moisture with independent testing, not just a supplier's own certificate. Check the processing site and storage — shea quality degrades with poor handling. And verify the exporter's license and past shipments, as with any supplier.",
      ]},
      { heading: "Getting it right", paragraphs: [
        "Specify your grade and metrics in the contract, test at sampling, and inspect at loading. That's the difference between the butter you approved and a surprise on arrival.",
      ]},
    ],
  },
  {
    slug: "letter-of-credit-basics-africa-buyers",
    title: "Letter of Credit basics for first-time Africa buyers",
    excerpt: "How an LC protects both sides, when it's worth the cost, and the simpler alternatives for smaller first orders.",
    readMins: 5,
    body: [
      { heading: "What a Letter of Credit does", paragraphs: [
        "A Letter of Credit (LC) is a bank's promise to pay the supplier once they present documents proving they shipped exactly what was agreed. It moves the trust from the supplier to a bank — the supplier ships knowing they'll be paid, and you pay knowing the goods were shipped to spec.",
      ]},
      { heading: "When it's worth it", paragraphs: [
        "LCs suit larger orders with a new supplier where neither side wants to take the full risk. They cost bank fees and take time to set up, so for a small first order they can be overkill.",
      ]},
      { heading: "Simpler alternatives for small orders", paragraphs: [
        "For a modest first shipment, a verified supplier plus staged payments (a small deposit, balance against inspection at loading) often gives enough protection at lower cost. The key word is verified — payment structure protects you far less if you never confirmed the supplier is real.",
      ]},
      { heading: "The common thread", paragraphs: [
        "Whichever instrument you use, it assumes the supplier exists and can deliver. Verification comes first; payment mechanics come second.",
      ]},
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
