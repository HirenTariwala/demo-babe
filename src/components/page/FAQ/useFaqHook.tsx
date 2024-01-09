import { useMediaQuery } from "@mui/material";
import { useTranslations } from "next-intl"


const useFaqHook = () => {
  const isTablet = useMediaQuery('(max-width:1024px)');
  const isMobile = useMediaQuery('(max-width:600px)');
  const t = useTranslations('faqPage.accordionLabel')

  const data = [
    {
      type: "general",
      question: t("genQue1"),
      answer: t("genAns1"),
      image: ""
    },
    {
      type: "general",
      question:  t("genQue2"),
      answer:  t("genAns2"),
      image: ""
    },
    {
      type: "general",
      question:  t("genQue3"),
      answer:  t("genAns3"),
      image: "https://images.rentbabe.com/IMAGES/FAQ/beababebutton.png"
    },
    {
      type: "general",
      question:  t("genQue4"),
      answer:  t("genAns4"),
      image: ""
    },
    {
      type: "general",
      question:  t("genQue5"),
      answer:  t("genAns5"),
      image: ""
    },
    {
      type: "general",
      question:  t("genQue6"),
      answer:  t("genAns6"),
      image: ""
    },
    {
      type: "how to rent?",
      question: t("rentQue1"),
      answer: t("rentAns1"),
      image: ""
    },
    {
      type: "how to rent?",
      question: t("rentQue2"),
      answer: t("rentAns2"),
      image: ""
    },
    {
      type: "rules",
      question: t("ruleQue1"),
      answer: t("ruleAns1"),
      image: ""
    },
    {
      type: "rules",
      question: t("ruleQue2"),
      answer: t("ruleAns2"),
      image: "https://images.rentbabe.com/TERMS/termsv2.png"
    },
    {
      type: "refunds",
      question:  t("refundQue1"),
      answer: t("refundAns1"),
      image: ""
    },
    {
      type: "refunds",
      question: t("refundQue2"),
      answer: t("refundAns2"),
      image: ""
    },
    {
      type: "credit",
      question: t("creditQue1"),
      answer: t("creditAns1"),
      image: ""
    },
    {
      type: "credit",
      question: t("creditQue2"),
      answer: t("creditAns2"),
      image: ""
    },
    {
      type: "credit",
      question: t("creditQue3"),
      answer: t("creditAns3"),
      image: ""
    },
    {
      type: "credit",
      question: t("creditQue4"),
      answer: t("creditAns4"),
      image: ""
    },
    {
      type: "credit",
      question: t("creditQue5"),
      answer: t("creditAns5"),
      image: ""
    },
    {
      type: "credit",
      question: t("creditQue6"),
      answer: t("creditAns6"),
      image: ""
    }
  ]

  return { 
    data,
    isTablet,
    isMobile
  }
    
  
}

export default useFaqHook