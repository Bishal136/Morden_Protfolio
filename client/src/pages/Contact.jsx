import { useState } from 'react';
import {
  Mail,
  MapPin,
  Send,
  CheckCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/common/SocialIcons';
import { useGetProfileQuery } from '../features/profile/profileApiSlice';

export const Contact = () => {
  const { data: profile } = useGetProfileQuery();

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);

    const mailtoSubject = encodeURIComponent(formState.subject || 'Portfolio Contact');
    const mailtoBody = encodeURIComponent(
      `Hi Bishal,\n\n${formState.message}\n\n— ${formState.name} (${formState.email})`
    );
    window.location.href = `mailto:${email}?subject=${mailtoSubject}&body=${mailtoBody}`;

    setSending(false);
    setSubmitted(true);
    setFormState({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 6000);
  };

  const email = profile?.socialLinks?.email || 'bishalbiswas2026@gmail.com';
  const github = profile?.socialLinks?.github || 'https://github.com';
  const linkedin = profile?.socialLinks?.linkedin || 'https://linkedin.com';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-800/40 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <MessageSquare size={14} />
          <span>Get In Touch</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Let's Work Together
        </h1>
        <p className="text-slate-400 text-base sm:text-lg">
          Whether you're looking to hire for a full-time position, collaborate on a project, or just say hello — I'd love to hear from you!
        </p>
      </div>

      {/* Grid: Contact Info + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
        {/* Left Column: Direct Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Sparkles size={18} className="text-blue-400" />
              <span>Contact Details</span>
            </h2>

            <div className="space-y-4">
              {/* Email Card */}
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-blue-500/40 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800/50 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <Mail size={22} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Email
                  </span>
                  <span className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors break-all">
                    {email}
                  </span>
                </div>
              </a>

              {/* LinkedIn Card */}
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-blue-500/40 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800/50 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <LinkedinIcon size={22} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    LinkedIn
                  </span>
                  <span className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                    linkedin.com/in/bishal
                  </span>
                </div>
              </a>

              {/* GitHub Card */}
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-blue-500/40 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-800/50 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <GithubIcon size={22} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    GitHub
                  </span>
                  <span className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                    github.com/bishal
                  </span>
                </div>
              </a>

              {/* Location Card */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                  <MapPin size={22} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Location & Timezone
                  </span>
                  <span className="text-sm font-semibold text-slate-300">
                    Open to Remote / Global Work
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Message Form */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Send a Direct Message</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Fill in the form below and I'll respond as soon as possible.
            </p>
          </div>

          {submitted && (
            <div className="p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-sm font-medium rounded-2xl flex items-center gap-3 animate-in fade-in">
              <CheckCircle size={20} className="shrink-0" />
              <span>Thank you! Your message has been sent. I'll get back to you shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  value={formState.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Your Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="john@example.com"
                  value={formState.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                placeholder="Project Inquiry / Job Opportunity"
                value={formState.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Message *
              </label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Write your message here..."
                value={formState.message}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send size={16} />
              <span>{sending ? 'Sending Message...' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
