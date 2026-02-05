
"use client";
import { useState } from "react";
import Image from "next/image";
import { FiUser, FiMail, FiPhone, FiArrowRight } from "react-icons/fi";
import { SiDiscord } from "react-icons/si";

interface BoosterApplyFormProps {
  heroImage: string;
}

export default function BoosterApplyForm({ heroImage }: BoosterApplyFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    discord: "",
    whatsapp: "",
    games: "",
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/booster/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus({
          type: 'success',
          message: "You will be contacted shortly by the Booster Acceptance team. Please prepare your ID card as it will be requested by the Gamingqu team for requirements."
        });
        // Reset form
        setFormData({ fullName: "", email: "", discord: "", whatsapp: "", games: "" });
      } else {
        setStatus({ type: 'error', message: data?.error ?? "An error occurred" });
      }
    } catch {
      setStatus({ type: 'error', message: "Failed to submit application" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 glass-card rounded-3xl shadow-2xl overflow-hidden border border-white/10 relative z-10">
      
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex flex-col relative justify-between overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
            <Image 
                src={heroImage} 
                alt="Game Art" 
                fill
                className="object-cover"
            />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-indigo-900/40 to-cyan-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-transparent to-transparent" />

        <div className="relative z-10 p-8 h-full flex flex-col justify-end">
            <h2 className="text-3xl font-black text-white mb-3 leading-tight">
                <span className="gradient-text">Join Our Team</span> of Elite Boosters
            </h2>
            <p className="text-gray-300 text-base leading-relaxed">
                Turn your gaming skills into earnings. Help others achieve their goals while playing the games you love.
            </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="p-6 lg:p-12 flex flex-col justify-center relative bg-[#0A0E17]/80 lg:bg-transparent">
        <div className="w-full mx-auto space-y-5">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-black text-white mb-2">
                Apply as <span className="gradient-text">Booster</span>
              </h1>
              <p className="text-gray-400">Fill in the details below to start your journey</p>
            </div>

            {status && (
              status.type === 'success' ? (
                <div role="alert" className="rounded-xl py-4 px-5 bg-emerald-900/30 border border-emerald-600/40 text-emerald-200">
                  <div className="text-sm leading-relaxed">
                    <div className="font-bold text-emerald-300">Your application has been submitted successfully</div>
                    <div>{status.message}</div>
                  </div>
                </div>
              ) : (
                <div role="alert" className="rounded-xl py-3 px-4 bg-red-900/20 border border-red-600/30 text-red-200">
                  <span className="text-sm">{status.message}</span>
                </div>
              )
            )}

            <form onSubmit={submit} className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {/* Full Name */}
                    <div className="form-control">
                        <label className="label text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                <FiUser className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="input w-full pl-11 h-12 bg-[#0A0E17] border-2 border-transparent hover:border-blue-500 focus:border-blue-500 focus:ring-0 text-white placeholder-gray-500 rounded-xl transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="form-control">
                        <label className="label text-sm font-medium text-gray-300 mb-1">Email</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                <FiMail className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="input w-full pl-11 h-12 bg-[#0A0E17] border-2 border-transparent hover:border-blue-500 focus:border-blue-500 focus:ring-0 text-white placeholder-gray-500 rounded-xl transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                                required
                            />
                        </div>
                    </div>

                    {/* Discord */}
                    <div className="form-control">
                        <label className="label text-sm font-medium text-gray-300 mb-1">Discord</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                <SiDiscord className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input
                                id="discord"
                                name="discord"
                                type="text"
                                value={formData.discord}
                                onChange={handleChange}
                                placeholder="username#1234"
                                className="input w-full pl-11 h-12 bg-[#0A0E17] border-2 border-transparent hover:border-blue-500 focus:border-blue-500 focus:ring-0 text-white placeholder-gray-500 rounded-xl transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                                required
                            />
                        </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="form-control">
                        <label className="label text-sm font-medium text-gray-300 mb-1">WhatsApp</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                <FiPhone className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                            </div>
                            <input
                                id="whatsapp"
                                name="whatsapp"
                                type="text"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                placeholder="+1234567890"
                                className="input w-full pl-11 h-12 bg-[#0A0E17] border-2 border-transparent hover:border-blue-500 focus:border-blue-500 focus:ring-0 text-white placeholder-gray-500 rounded-xl transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-control">
                    <label className="label text-sm font-medium text-gray-300 mb-1">
                        Which games do you usually play?
                    </label>
                    <textarea
                        name="games"
                        value={formData.games}
                        onChange={handleChange}
                        className="textarea w-full bg-[#0A0E17] border-2 border-transparent hover:border-blue-500 focus:border-blue-500 focus:ring-0 text-white placeholder-gray-500 rounded-xl transition-all duration-300 focus:shadow-[0_0_20px_rgba(139,92,246,0.2)] h-32"
                        placeholder="Tell us about your gaming experience and the games you excel at..."
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading} 
                    className="btn btn-gaming w-full h-12 text-base font-bold rounded-xl mt-4"
                >
                    {loading ? <span className="loading loading-spinner loading-md"></span> : "Apply Now"}
                    {!loading && <FiArrowRight className="h-5 w-5 ml-2" />}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}
