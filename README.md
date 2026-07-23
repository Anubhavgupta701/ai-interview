# Interviewer – AI Mock Interview Platform That Actually Judges You.



<p align="center">
  <a href="https://your-live-link.com"><img src="https://img.shields.io/badge/🚀%20Live%20Demo-Visit%20Now-00C853?style=for-the-badge" /></a>
  <a href="https://github.com/your-username/interviewer"><img src="https://img.shields.io/github/stars/your-username/interviewer?style=for-the-badge&color=yellow" /></a>
  <a href="https://your-live-link.com"><img src="https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge" /></a>
</p>

<p align="center">
  <b>An end-to-end AI SaaS that converts your Resume into a real interview, evaluates your voice & content, and gives you a downloadable performance report.</b>
</p>

---

## 📌 Table of Contents
- [Why I Built This](#-why-i-built-this)
- [Live Demo & Screenshots](#-live-demo--screenshots)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Tech Stack - Deep Dive](#-tech-stack---deep-dive)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Roadmap](#-roadmap)
- [Author](#-author)

### 🎯 Why I Built This
LeetCode does not teach you how to *speak*. YouTube mocks don't give you data.

I failed to quantify my own interview performance, so I built a system that measures what actually matters:
**Confidence, Correctness, Communication Clarity.**

### 🔥 Live Demo & Screenshots

**Live URL:** https://rk-interviewer.onrender.com

| Feature | Preview |
| :--- | :--- |
| **AI Resume Analysis** | ![resume](https://via.placeholder.com/400x200?text=Resume+Analysis+SS) |
| **Voice Interview UI** | ![interview](https://via.placeholder.com/400x200?text=Interview+UI+SS) |
| **Final Report PDF** | ![report](https://via.placeholder.com/400x200?text=Final+Report+SS) |

### 🏗️ System Architecture

This is not a simple API wrapper. This is a complete pipeline.

```mermaid
graph TD
    A[User: Role / Resume Upload] --> B{AI Parser Service}
    B -->|Extracts Skills, Projects, JD| C[Prompt Engine]
    C --> D[LLM - GPT-4o / Gemini - Generates 5 Qs]
    D --> E[Interview Engine - Voice/Text]
    E --> F[STT - Whisper / Web Speech API]
    F --> G[Evaluation Engine]
    G -->|Scores Confidence, Correctness, Filler Words| H[Report Generator]
    H --> I[PDF Report + Dashboard]
    E --> J[Razorpay Credit Logic]
