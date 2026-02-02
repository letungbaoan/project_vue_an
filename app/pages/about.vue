<script setup lang="ts">
import { Target, Clock, Globe, Linkedin, Twitter, Mail } from "lucide-vue-next";

// Dữ liệu Team giả lập (Không cần lưu DB vì thường là tĩnh)
const teamMembers = [
  {
    name: "John Doe",
    role: "Founder & CEO",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "Lina Phùng",
    role: "Head of Education",
    image:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "Michael Chen",
    role: "Lead Developer",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "Sarah Smith",
    role: "Product Designer",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
  },
];
</script>

<template>
  <div class="font-sans text-secondary">
    <section
      class="relative bg-primary py-24 px-6 text-center text-white rounded-b-[50px] md:rounded-b-[80px]"
    >
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          {{ $t("about.hero_title") }}
        </h1>
        <p class="text-xl md:text-2xl opacity-90 font-light">
          {{ $t("about.hero_desc") }}
        </p>
      </div>
      <div
        class="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-2xl"
      ></div>
      <div
        class="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"
      ></div>
    </section>

    <section class="max-w-7xl mx-auto px-6 py-24">
      <div class="grid md:grid-cols-2 gap-16 items-center">
        <div class="grid grid-cols-2 gap-4">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600"
            class="rounded-3xl shadow-lg mt-12 w-full h-64 object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80&w=600"
            class="rounded-3xl shadow-lg w-full h-64 object-cover"
          />
        </div>

        <div>
          <h2
            class="text-3xl font-bold text-[#2f327d] mb-6 relative inline-block"
          >
            {{ $t("about.story_title") }}
            <span
              class="absolute bottom-0 left-0 w-1/2 h-1 bg-primary rounded-full"
            ></span>
          </h2>
          <div class="space-y-6 text-lg leading-relaxed text-secondary">
            <p>{{ $t("about.story_content_1") }}</p>
            <p>{{ $t("about.story_content_2") }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-gray-50 py-24 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-[#2f327d]">
            {{ $t("about.values_title") }}
          </h2>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            class="bg-background p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 group"
          >
            <div
              class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors"
            >
              <Target class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-bold text-[#2f327d] mb-3">
              {{ $t("about.value_1_title") }}
            </h3>
            <p class="text-secondary">{{ $t("about.value_1_desc") }}</p>
          </div>

          <div
            class="bg-background p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 group"
          >
            <div
              class="w-14 h-14 bg-[#f48c06]/10 rounded-2xl flex items-center justify-center text-[#f48c06] mb-6 group-hover:bg-[#f48c06] group-hover:text-white transition-colors"
            >
              <Clock class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-bold text-[#2f327d] mb-3">
              {{ $t("about.value_2_title") }}
            </h3>
            <p class="text-secondary">{{ $t("about.value_2_desc") }}</p>
          </div>

          <div
            class="bg-background p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 group"
          >
            <div
              class="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors"
            >
              <Globe class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-bold text-[#2f327d] mb-3">
              {{ $t("about.value_3_title") }}
            </h3>
            <p class="text-secondary">{{ $t("about.value_3_desc") }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6 py-24">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-[#2f327d] mb-2">
          {{ $t("about.team_title") }}
        </h2>
        <p class="text-secondary">{{ $t("about.team_subtitle") }}</p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="(member, index) in teamMembers"
          :key="index"
          class="group text-center"
        >
          <div class="relative mb-6 inline-block">
            <div
              class="absolute inset-0 bg-primary rounded-full blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"
            ></div>
            <img
              :src="member.image"
              class="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg relative z-10 transform group-hover:scale-105 transition duration-300"
            />
          </div>
          <h3 class="text-xl font-bold text-[#2f327d]">{{ member.name }}</h3>
          <p class="text-primary font-medium text-sm mb-4">{{ member.role }}</p>

          <div
            class="flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0"
          >
            <a href="#" class="text-gray-400 hover:text-primary"
              ><Linkedin class="w-5 h-5"
            /></a>
            <a href="#" class="text-gray-400 hover:text-primary"
              ><Twitter class="w-5 h-5"
            /></a>
            <a href="#" class="text-gray-400 hover:text-primary"
              ><Mail class="w-5 h-5"
            /></a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
