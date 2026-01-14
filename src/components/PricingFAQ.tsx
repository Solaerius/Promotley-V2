import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Behöver jag kortuppgifter?",
    answer: "Nej! Du kan skapa din första strategi helt gratis utan att ange någon betalmetod. Prova Promotely utan risk.",
  },
  {
    question: "Kan jag avbryta när som helst?",
    answer: "Absolut. Det finns inga bindningstider. Du kan avsluta din prenumeration direkt från dina inställningar när du vill.",
  },
  {
    question: "Hur snabbt får jag resultat?",
    answer: "De flesta företag ser förbättrat engagemang inom de första 2-4 veckorna efter att de börjat följa sin personliga strategi från Promotely.",
  },
  {
    question: "Vad händer om jag byter plan?",
    answer: "Du kan uppgradera eller nedgradera din plan när som helst. Ändringen träder i kraft vid nästa faktureringsperiod.",
  },
  {
    question: "Passar Promotely mitt UF-företag?",
    answer: "Ja! Promotely är designat specifikt för UF-företag och startups. Vi anpassar strategin efter din budget, bransch och tillgängliga tid.",
  },
];

const PricingFAQ = () => {
  return (
    <div className="max-w-3xl mx-auto mt-20 px-4">
      <h3 className="text-3xl font-bold text-center mb-8 text-white">
        Vanliga frågor
      </h3>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
            <AccordionTrigger className="text-left text-lg font-semibold text-white hover:text-white/80">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-white/60 leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default PricingFAQ;
