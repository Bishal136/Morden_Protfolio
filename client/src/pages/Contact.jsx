import React, { useState } from 'react';
import {
  MapPin,
  Send,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  Sparkles,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/common/SocialIcons';
import { useGetProfileQuery } from '../features/profile/profileApiSlice';
import { useSendMessageMutation } from '../features/messages/messagesApiSlice';
import useDocumentTitle from '../hooks/useDocumentTitle';
import siteConfig from '../config/siteConfig';

export const Contact = () => {
  useDocumentTitle('Contact | Bishal Biswas — Full-Stack MERN Developer');

  const { data: profile } = useGetProfileQuery();
  const email = profile?.socialLinks?.email || siteConfig.email;
  const github = profile?.socialLinks?.github || siteConfig.socialLinks.github;
  const linkedin = profile?.socialLinks?.linkedin || siteConfig.socialLinks.linkedin;

  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState(false);
  const [serverError, setServerError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // One-click Copy Email with Toast feedback
  const handleCopyEmail = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  const validate = () => {
    const errs = {};
    if (!formState.name.trim()) {
      errs.name = 'Please provide your name';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formState.email.trim() || !emailRegex.test(formState.email.trim())) {
      errs.email = 'Please provide a valid email address';
    }
    if (!formState.message.trim() || formState.message.trim().length < 10) {
      errs.message = 'Please write a message with at least 10 characters';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setServerError('');

    try {
      await sendMessage({
        name: formState.name.trim(),
        email: formState.email.trim(),
        subject: formState.subject.trim() || 'General Inquiry',
        message: formState.message.trim(),
      }).unwrap();

      setSubmitted(true);
      setFormState({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 9000);
    } catch (err) {
      setServerError(
        err?.data?.message || 'Failed to dispatch message to server. Please try again or reach out directly via email.'
      );
    }
  };

  return (
    <div className="pt-28 md:pt-32 scroll-mt-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-24">
      {/* Header Container */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-mono font-semibold uppercase tracking-widest text-sky-600 block">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Let's Build Together
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Open to full-time developer roles, systems & web consulting, or open-source collaborations. Drop me a line directly.
        </p>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Direct Contact & Availability Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Email Copy Card with One-Click Button */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-sky-600">
                Primary Inbox
              </span>
              {copied && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-medium">
                  <Check size={12} /> Copied to clipboard!
                </span>
              )}
            </div>

            <div className="flex flex-col space-y-3">
              <a
                href={`mailto:${email}`}
                className="text-base sm:text-lg font-bold text-slate-900 hover:text-sky-600 transition-colors break-all font-mono"
              >
                {email}
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center justify-center gap-2 transition-all focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                aria-label="Copy email address to clipboard"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} className="text-slate-400" />
                    <span>Copy Email Address</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Timezone & Availability Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-sky-600 flex items-center gap-1.5">
              <Clock size={14} />
              <span>Availability & Timezone</span>
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-slate-900 font-semibold">Ready for Full-Time Roles & Consulting</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-sky-600 shrink-0" />
                <span>Asia / Dhaka (UTC+6) — Flexible Global Remote Overlap</span>
              </div>
            </div>
          </div>

          {/* Verified Social Channels */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-sky-600 flex items-center gap-1.5">
              <Sparkles size={14} />
              <span>Verified Profiles</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 hover:bg-slate-100 transition-colors flex items-center justify-between group focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                aria-label="GitHub Profile (Bishal136)"
              >
                <div className="flex items-center gap-2.5">
                  <GithubIcon size={18} className="text-slate-700 group-hover:text-slate-900" />
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">GitHub</span>
                </div>
                <ExternalLink size={12} className="text-slate-400 group-hover:text-sky-600" />
              </a>

              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 hover:bg-slate-100 transition-colors flex items-center justify-between group focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                aria-label="LinkedIn Profile"
              >
                <div className="flex items-center gap-2.5">
                  <LinkedinIcon size={18} className="text-slate-700 group-hover:text-slate-900" />
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">LinkedIn</span>
                </div>
                <ExternalLink size={12} className="text-slate-400 group-hover:text-sky-600" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Validated Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Send a Direct Message
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Your inquiry triggers a priority notification to my inbox.
            </p>
          </div>

          {submitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-2xl flex items-center gap-3 animate-in fade-in duration-300 shadow-sm">
              <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
              <div>
                <p className="font-semibold text-emerald-900">Message Delivered Successfully!</p>
                <p className="text-[11px] sm:text-xs text-emerald-700 mt-0.5">
                  Thank you for reaching out. Your direct message has been logged, and Bishal will review and respond within 24 hours.
                </p>
              </div>
            </div>
          )}

          {serverError && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-2xl flex items-center gap-3 animate-in fade-in duration-300">
              <AlertCircle size={20} className="shrink-0 text-rose-600" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-mono font-medium text-slate-700 mb-1.5">
                  Full Name <span className="text-sky-600">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder="Alex Rivera"
                  value={formState.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-sky-500/20 focus-visible:outline-none transition-colors ${
                    errors.name ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-sky-500'
                  }`}
                />
                {errors.name && (
                  <span className="text-[11px] text-rose-600 flex items-center gap-1 mt-1 font-medium">
                    <AlertCircle size={11} /> {errors.name}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-mono font-medium text-slate-700 mb-1.5">
                  Email Address <span className="text-sky-600">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="alex@company.com"
                  value={formState.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-sky-500/20 focus-visible:outline-none transition-colors ${
                    errors.email ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-sky-500'
                  }`}
                />
                {errors.email && (
                  <span className="text-[11px] text-rose-600 flex items-center gap-1 mt-1 font-medium">
                    <AlertCircle size={11} /> {errors.email}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="contact-subject" className="block text-xs font-mono font-medium text-slate-700 mb-1.5">
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                placeholder="Software Engineering Collaboration"
                value={formState.subject}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/20 focus-visible:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-mono font-medium text-slate-700 mb-1.5">
                Message <span className="text-sky-600">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                placeholder="Hi Bishal, we loved your case studies and would like to discuss..."
                value={formState.message}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-sky-500/20 focus-visible:outline-none transition-colors resize-none ${
                  errors.message ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-sky-500'
                }`}
              />
              {errors.message && (
                <span className="text-[11px] text-rose-600 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle size={11} /> {errors.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3.5 px-6 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-60 text-white font-bold text-xs sm:text-sm tracking-tight flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
            >
              <Send size={15} />
              <span>{sending ? 'Dispatching Message...' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
