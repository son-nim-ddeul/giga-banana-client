'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2,
  Wand2,
  MousePointer2,
  Layers,
  Edit3,
  Image as ImageIcon,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { Footer } from '@/components/footer';
import { BananaLogo } from '@/components/banana-logo';
import { LandingNav } from '@/components/landing-nav';
import { ComparisonSlider } from '@/components/comparison-slider';

const features = [
  {
    icon: MousePointer2,
    title: '원클릭 개체 제거',
    description: '이미지 속 원치 않는 사람이나 사물을 브러시로 쓱 칠하기만 하세요. AI가 배경과 조화롭게 채워줍니다.',
  },
  {
    icon: Layers,
    title: '배경 교체 및 확장',
    description: '지루한 배경을 화려한 풍경으로 교체하거나, 이미지의 캔버스를 자연스럽게 확장하여 새로운 구도를 만듭니다.',
  },
  {
    icon: Edit3,
    title: '스타일 트랜스퍼',
    description: '사진을 유화, 수채화, 사이버펑크 등 원하는 예술적 스타일로 즉시 변환하여 독특한 분위기를 연출하세요.',
  },
  {
    icon: Sparkles,
    title: '화질 개선(Upscaling)',
    description: '저해상도 이미지를 최대 4배까지 선명하게 만듭니다. 노이즈를 제거하고 디테일을 살려보세요.',
  },
  {
    icon: ImageIcon,
    title: '텍스트 투 이미지',
    description: '아이디어를 설명하기만 하면 AI가 세상에 없던 고해상도 이미지를 새롭게 생성해 드립니다.',
  },
  {
    icon: Wand2,
    title: '스마트 컬러 보정',
    description: '사진의 톤과 조명을 AI가 분석하여 최적의 색감을 찾아줍니다. 단 한 번의 클릭으로 완성되는 후보정.',
  },
];

const stats = [
  { label: 'Active Users', value: '100K+' },
  { label: 'Images Created', value: '25M+' },
  { label: 'Processing Speed', value: '0.5s' },
  { label: 'User Satisfaction', value: '99%' },
];

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => {
    setIsLoading(true);
    if (isAuthenticated) {
      router.push('/creations');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-1 font-sans selection:bg-primary-1">
      {/* Navigation */}
      <LandingNav onStartClick={handleStart} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-1 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-yellow-100 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-1 rounded-full text-primary-2 font-bold text-sm mb-6">
              <Zap className="w-4 h-4" />
              <span>Simple AI-Powered Image Editing</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-8 tracking-tight text-neutral-3">
              복잡한 편집은 끝, <br />
              <span className="text-primary-2">AI로 완성하세요</span>
            </h1>

            <p className="text-xl text-neutral-2 mb-10 leading-relaxed max-w-lg">
              상상하는 이미지를 말 한마디로 구현하세요. 전문가의 손길이 닿은 듯한 고품질 이미지 편집을 누구나 쉽고 빠르게 시작할 수 있습니다.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleStart}
                disabled={isLoading}
                className="group flex items-center justify-center gap-2 bg-primary-2 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:translate-y-[-2px] transition-all shadow-lg hover:shadow-xl hover:bg-primary-3 disabled:opacity-80"
              >
                {isLoading ? '확인 중...' : '무료로 시작하기'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center justify-center gap-2 bg-white text-neutral-3 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-neutral-100 transition-all border border-neutral-1">
                데모 보기
              </button>
            </div>

            <div className="mt-12 flex items-center gap-4 text-sm text-neutral-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-primary-1"
                  />
                ))}
              </div>
              <span>이미 10,000+ 명의 크리에이터가 사용 중</span>
            </div>
          </motion.div>

          {/* Right Content - Comparison Slider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative z-10 bg-white p-4 rounded-3xl shadow-2xl border border-neutral-1">
              <ComparisonSlider
                beforeImage="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop"
                afterImage="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop"
              />
            </div>

            {/* Floating Badge - Top Right */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-6 -right-6 z-20 bg-white p-4 rounded-2xl shadow-xl border border-neutral-1 flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="text-green-600 w-5 h-5" />
              </div>
              <span className="font-bold text-sm text-neutral-3">Background Removed</span>
            </motion.div>

            {/* Floating Badge - Bottom Left */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -bottom-4 -left-6 z-20 bg-white p-4 rounded-2xl shadow-xl border border-neutral-1 flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Wand2 className="text-blue-600 w-5 h-5" />
              </div>
              <span className="font-bold text-sm text-neutral-3">Magic Upscaling Active</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold mb-6 tracking-tight text-neutral-3">
              상상력이 현실이 되는 도구들
            </h2>
            <p className="text-lg text-neutral-2">
              디자인 기술이 없어도 괜찮습니다. Giga Banana의 강력한 AI 엔진이 복잡한 작업들을 단 몇 초 만에 해결해 드립니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-neutral-1 p-8 border border-neutral-1 rounded-2xl hover:shadow-lg transition-shadow group"
                >
                  <div className="w-12 h-12 bg-primary-1 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="text-primary-2 w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-neutral-3">{feature.title}</h3>
                  <p className="text-neutral-2 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-primary-2 rounded-[3rem] p-12 lg:p-20 text-white relative overflow-hidden shadow-2xl"
          >
            {/* Decorative background */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

            <h2 className="text-4xl lg:text-5xl font-bold mb-8 relative z-10 leading-tight">
              이제, 복잡한 툴 대신 <br className="hidden sm:block" /> AI의 힘을 빌려보세요
            </h2>
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto relative z-10">
              이미지 편집의 패러다임이 바뀝니다. 더 이상 수동 작업에 시간을 낭비하지 마세요.
              Giga Banana가 당신의 창의성을 극대화합니다.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
              <button
                onClick={handleStart}
                className="w-full sm:w-auto px-10 py-5 bg-white text-primary-2 font-bold text-xl rounded-2xl hover:shadow-xl transition-all hover:scale-105 active:scale-95"
              >
                지금 시작하기
              </button>
              <button className="w-full sm:w-auto px-10 py-5 border-2 border-white/30 text-white font-bold text-xl rounded-2xl hover:bg-white/10 transition-all">
                가격 정책 확인
              </button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10 border-t border-white/10 pt-16">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-neutral-1">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 font-bold text-xl">
            <BananaLogo size="sm" animated={false} />
            <span className="text-neutral-3">Giga Banana</span>
          </div>
          <Footer />
          <div className="flex gap-6 text-sm font-medium text-neutral-2">
            <a href="#" className="hover:text-primary-2 transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary-2 transition-colors">Terms</a>
            <a href="#" className="hover:text-primary-2 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
