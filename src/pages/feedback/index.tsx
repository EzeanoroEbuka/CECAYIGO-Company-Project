import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  PhoneCall, 
  ShieldAlert, 
  Clock, 
  Send, 
  FileText, 
  ExternalLink,
  MessageCircle,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { feedbackService, FeedbackSubmission } from "@/services/feedbackService";

export default function FeedbackAndComplaintsPage() {
  const [formData, setFormData] = useState({
    type: "complaint" as FeedbackSubmission["type"],
    name: "",
    email: "",
    phone: "",
    orderNumber: "",
    productName: "",
    priority: "medium" as FeedbackSubmission["priority"],
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [copiedTicket, setCopiedTicket] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in your name, email, and description.");
      return;
    }

    try {
      setIsSubmitting(true);
      const ticketId = await feedbackService.submitFeedback({
        type: formData.type,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        orderNumber: formData.orderNumber || undefined,
        productName: formData.productName || undefined,
        priority: formData.priority,
        subject: formData.subject || `${formData.type.toUpperCase()} from ${formData.name}`,
        message: formData.message
      });

      setSubmittedTicket(ticketId);
      toast.success(`Complaint/Feedback received! Your ticket ID is ${ticketId}`);
    } catch (err) {
      console.error(err);
      toast.error("Could not submit feedback. Please reach out via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyTicket = () => {
    if (submittedTicket) {
      navigator.clipboard.writeText(submittedTicket);
      setCopiedTicket(true);
      toast.success("Ticket ID copied to clipboard!");
      setTimeout(() => setCopiedTicket(false), 2000);
    }
  };

  const companyWhatsApp = "2348147254399";
  const openWhatsAppEscalation = () => {
    const text = `Hello CeC Ayigo Support Team, I am contacting you regarding Ticket ID: ${submittedTicket || "NEW"}.\n\nCategory: ${formData.type.toUpperCase()}\nName: ${formData.name}\nPhone: ${formData.phone}\nOrder Ref: ${formData.orderNumber || "N/A"}\nSummary: ${formData.message}`;
    const url = `https://wa.me/${companyWhatsApp}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <Head>
        <title>Customer Feedback & Complaints Portal | CeC Ayigo</title>
        <meta 
          name="description" 
          content="Official CeC Ayigo customer resolution portal. Submit product feedback, file a warranty complaint, or report an order issue for rapid investigation." 
        />
      </Head>

      <div className="min-h-screen bg-background py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-red/10 text-brand-red text-xs md:text-sm font-semibold mb-3 border border-brand-red/20">
              <ShieldAlert className="h-4 w-4" />
              Official Company Resolution & Quality Assurance
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight mb-4">
              Feedback & Customer Complaints
            </h1>
            <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
              At <strong>CeC Ayigo</strong>, customer satisfaction is our top priority. Whether you have an issue with an electrical product, need warranty assistance, or want to share feedback to help us improve, our quality assurance team investigates every ticket thoroughly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: The Submission Form or Ticket Confirmation */}
            <div className="lg:col-span-2">
              <Card className="border border-border shadow-md bg-card rounded-2xl overflow-hidden">
                <CardHeader className="bg-muted border-b border-border p-6">
                  <CardTitle className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                    <FileText className="h-5 w-5 text-brand-red" />
                    {submittedTicket ? "Ticket Confirmation" : "Submit a Complaint or Feedback"}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-sm">
                    {submittedTicket 
                      ? "Your submission has been cataloged in our company ticketing system."
                      : "Please provide clear details so our engineering or dispatch team can assist you."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 md:p-8">
                  {submittedTicket ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6 text-center py-6"
                    >
                      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                        <CheckCircle2 className="h-9 w-9" />
                      </div>
                      
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-1">Complaint Logged Successfully!</h3>
                        <p className="text-sm text-muted-foreground">Our customer quality team typically responds within 2 to 6 business hours.</p>
                      </div>

                      {/* Ticket Box */}
                      <div className="bg-muted border-2 border-dashed border-border p-5 rounded-xl max-w-md mx-auto">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-1">Your Tracking Ticket ID</span>
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-2xl font-mono font-bold text-brand-red">{submittedTicket}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCopyTicket}
                            className="h-8 px-2.5 text-xs border-border bg-white"
                          >
                            {copiedTicket ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                          </Button>
                        </div>
                        <span className="text-xs text-muted-foreground mt-2 block">Keep this ticket ID for follow-ups or warranty claims.</span>
                      </div>

                      {/* Quick Escalation Button */}
                      <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                        <Button
                          onClick={openWhatsAppEscalation}
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm"
                        >
                          <MessageCircle className="h-5 w-5" />
                          Chat with Support on WhatsApp
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSubmittedTicket(null);
                            setFormData({
                              type: "complaint",
                              name: "",
                              email: "",
                              phone: "",
                              orderNumber: "",
                              productName: "",
                              priority: "medium",
                              subject: "",
                              message: ""
                            });
                          }}
                          className="border-border text-foreground/80 hover:bg-muted rounded-xl"
                        >
                          Submit Another Ticket
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      
                      {/* Ticket Type Selector */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          What is the nature of your request? *
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {[
                            { value: "complaint", label: "Product Complaint", desc: "Defect or malfunction" },
                            { value: "order_issue", label: "Order / Delivery", desc: "Late or missing item" },
                            { value: "warranty", label: "Warranty Claim", desc: "Repair or replacement" },
                            { value: "feedback", label: "General Feedback", desc: "Suggestions & reviews" },
                            { value: "general", label: "Inquiry / Help", desc: "Specification advice" }
                          ].map((t) => (
                            <button
                              key={t.value}
                              type="button"
                              onClick={() => setFormData(p => ({ ...p, type: t.value as any }))}
                              className={`p-3 text-left rounded-xl border text-xs sm:text-sm transition-all ${
                                formData.type === t.value
                                  ? "border-brand-red bg-brand-red/5 text-brand-red font-bold ring-1 ring-brand-red shadow-xs"
                                  : "border-border bg-muted text-foreground/80 hover:bg-muted"
                              }`}
                            >
                              <div className="font-semibold">{t.label}</div>
                              <div className="text-[11px] text-muted-foreground font-normal mt-0.5">{t.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Contact Info (Name, Email, Phone) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-foreground/80 mb-1">Your Full Name *</label>
                          <Input
                            required
                            placeholder="e.g. Babatunde Adeyemi"
                            value={formData.name}
                            onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                            className="bg-input border-border focus:border-brand-red rounded-xl text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-foreground/80 mb-1">Email Address *</label>
                          <Input
                            required
                            type="email"
                            placeholder="e.g. name@example.com"
                            value={formData.email}
                            onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                            className="bg-input border-border focus:border-brand-red rounded-xl text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-foreground/80 mb-1">Phone Number (WhatsApp Preferred)</label>
                          <Input
                            placeholder="e.g. +234 803 123 4567"
                            value={formData.phone}
                            onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                            className="bg-input border-border focus:border-brand-red rounded-xl text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-foreground/80 mb-1">Order Reference # (If applicable)</label>
                          <Input
                            placeholder="e.g. ORD-98124 or WhatsApp receipt"
                            value={formData.orderNumber}
                            onChange={e => setFormData(p => ({ ...p, orderNumber: e.target.value }))}
                            className="bg-input border-border focus:border-brand-red rounded-xl text-sm"
                          />
                        </div>
                      </div>

                      {/* Product Name & Urgency */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-foreground/80 mb-1">Product Name / Model</label>
                          <Input
                            placeholder="e.g. CeC Floodlight 100W or Inverter 3.5kVA"
                            value={formData.productName}
                            onChange={e => setFormData(p => ({ ...p, productName: e.target.value }))}
                            className="bg-input border-border focus:border-brand-red rounded-xl text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-foreground/80 mb-1">Priority Level</label>
                          <select
                            value={formData.priority}
                            onChange={e => setFormData(p => ({ ...p, priority: e.target.value as any }))}
                            className="w-full h-10 px-3 rounded-xl border border-border bg-muted/50 text-sm text-foreground/80 focus:outline-none focus:border-brand-red"
                          >
                            <option value="low">Low - General question or mild feedback</option>
                            <option value="medium">Normal - Needs standard investigation</option>
                            <option value="urgent">Urgent - Electrical hazard / Major installation hold</option>
                          </select>
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="block text-xs font-semibold text-foreground/80 mb-1">Summary / Subject *</label>
                        <Input
                          required
                          placeholder="Brief summary of your complaint or feedback"
                          value={formData.subject}
                          onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))}
                          className="bg-input border-border focus:border-brand-red rounded-xl text-sm"
                        />
                      </div>

                      {/* Message Body */}
                      <div>
                        <label className="block text-xs font-semibold text-foreground/80 mb-1">Detailed Description *</label>
                        <Textarea
                          required
                          rows={5}
                          placeholder="Please explain what happened, how the product was wired or operated, and what outcome you are requesting (e.g. repair, replacement, technical guidance)..."
                          value={formData.message}
                          onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                          className="bg-input border-border focus:border-brand-red rounded-xl text-sm"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-brand-red hover:bg-brand-red-dark text-white font-semibold rounded-xl text-base shadow-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Recording Ticket...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Submit Complaint & Generate Ticket ID
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Direct Help, Showroom, Warranty Rules */}
            <div className="space-y-6">
              
              {/* WhatsApp Direct Card */}
              <Card className="border border-green-200 bg-green-50/70 rounded-2xl shadow-sm">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center gap-2 text-green-800 font-bold text-base">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    Instant WhatsApp Support
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-0 text-sm text-green-950 space-y-3">
                  <p>
                    Need an immediate reply for an emergency or urgent contractor question? Chat directly with our Lagos store engineers on WhatsApp.
                  </p>
                  <a
                    href={`https://wa.me/${companyWhatsApp}?text=${encodeURIComponent("Hello CeC Ayigo, I need assistance with a product.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl transition-colors shadow-xs"
                  >
                    <span>Message +234 814 725 4399</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </CardContent>
              </Card>

              {/* Showroom & Physical Inspection */}
              <Card className="border border-border bg-card rounded-2xl shadow-sm">
                <CardHeader className="p-5 pb-2">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <PhoneCall className="h-4 w-4 text-brand-red" />
                    Showroom & Physical Testing
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 text-xs md:text-sm text-muted-foreground space-y-2">
                  <p>
                    Customers and electricians are welcome to bring units directly to our service desk for testing and bench validation:
                  </p>
                  <div className="bg-muted p-3 rounded-lg border border-border">
                    <strong className="text-foreground block">CeC Ayigo Showroom:</strong>
                    <span>D442a Alaba International Market, Ojo, Lagos State, Nigeria.</span>
                    <div className="text-muted-foreground text-xs mt-1">Open Monday - Saturday: 8:00 AM - 5:30 PM WAT</div>
                  </div>
                </CardContent>
              </Card>

              {/* Warranty Policy Overview */}
              <Card className="border border-border bg-card rounded-2xl shadow-sm">
                <CardHeader className="p-5 pb-2">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-brand-blue-dark" />
                    CeC Ayigo Warranty Standards
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 text-xs text-muted-foreground space-y-2.5">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-1.5 flex-shrink-0" />
                    <span><strong>1 to 2 Years Warranty:</strong> Covers manufacturing defects on LED chips, internal drivers, and smart breakers.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-1.5 flex-shrink-0" />
                    <span><strong>Exclusions:</strong> Damage caused by intentional water submerging of non-submersible units, or lightning strikes with ground wires deliberately disconnected.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-red mt-1.5 flex-shrink-0" />
                    <span><strong>Replacement Turnaround:</strong> Verified warranty claims are serviced within 48 to 72 hours across Lagos.</span>
                  </div>
                </CardContent>
              </Card>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}
