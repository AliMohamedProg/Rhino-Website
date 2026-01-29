"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useLanguage } from "@/context/language-context"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  const { language } = useLanguage()

  const faqs = [
    {
      question: {
        en: "What are the delivery options?",
        ar: "ما هي خيارات التوصيل؟",
      },
      answer: {
        en: "We offer delivery to all 27 governorates in Egypt. Delivery time varies between 3-7 business days depending on your location. Free delivery is available for orders above 2000 EGP.",
        ar: "نوفر التوصيل لجميع المحافظات الـ 27 في مصر. يتراوح وقت التوصيل بين 3-7 أيام عمل حسب موقعك. التوصيل مجاني للطلبات فوق 2000 جنيه.",
      },
    },
    {
      question: {
        en: "What is your return policy?",
        ar: "ما هي سياسة الإرجاع؟",
      },
      answer: {
        en: "You can return any product within 14 days of delivery if it's in its original condition and packaging. Some products like mattresses have a 100-day trial period.",
        ar: "يمكنك إرجاع أي منتج خلال 14 يوماً من التوصيل إذا كان في حالته الأصلية وتغليفه. بعض المنتجات مثل المراتب لها فترة تجربة 100 يوم.",
      },
    },
    {
      question: {
        en: "How can I track my order?",
        ar: "كيف يمكنني تتبع طلبي؟",
      },
      answer: {
        en: "Once your order is shipped, you will receive an SMS and email with tracking information. You can also track your order through your account on our website.",
        ar: "بمجرد شحن طلبك، ستتلقى رسالة نصية وبريد إلكتروني بمعلومات التتبع. يمكنك أيضاً تتبع طلبك من خلال حسابك على موقعنا.",
      },
    },
    {
      question: {
        en: "Do you offer assembly services?",
        ar: "هل تقدمون خدمات التركيب؟",
      },
      answer: {
        en: "Yes, we offer professional assembly services for most furniture items. Assembly costs vary depending on the product and can be added during checkout.",
        ar: "نعم، نقدم خدمات تركيب احترافية لمعظم قطع الأثاث. تختلف تكاليف التركيب حسب المنتج ويمكن إضافتها أثناء الدفع.",
      },
    },
    {
      question: {
        en: "What payment methods do you accept?",
        ar: "ما طرق الدفع المقبولة؟",
      },
      answer: {
        en: "We accept cash on delivery, credit/debit cards (Visa, MasterCard), and installment plans through various banks and payment providers.",
        ar: "نقبل الدفع عند الاستلام، بطاقات الائتمان/الخصم (فيزا، ماستركارد)، وخطط التقسيط من خلال البنوك ومزودي الدفع المختلفين.",
      },
    },
    {
      question: {
        en: "Is there a warranty on products?",
        ar: "هل يوجد ضمان على المنتجات؟",
      },
      answer: {
        en: "Yes, all our products come with a manufacturer's warranty. The warranty period varies by product category, ranging from 1 to 10 years.",
        ar: "نعم، جميع منتجاتنا تأتي مع ضمان الشركة المصنعة. تختلف فترة الضمان حسب فئة المنتج، وتتراوح بين سنة و10 سنوات.",
      },
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-foreground text-center mb-4">
            {language === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
          </h1>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            {language === "ar"
              ? "اعثر على إجابات للأسئلة الأكثر شيوعاً حول التسوق والتوصيل والإرجاع"
              : "Find answers to the most common questions about shopping, delivery, and returns"}
          </p>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-lg px-6"
                >
                  <AccordionTrigger className="text-start hover:no-underline">
                    {faq.question[language]}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer[language]}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
