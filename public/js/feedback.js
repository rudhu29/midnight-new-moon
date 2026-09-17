/**
 * Nocturne Vault - Community Feedback Module (Level 5 Milestone)
 * Manages fetching, rendering, and submitting tester feedback
 */

import { playClickSound, playSuccessChime } from './audio.js';
import { triggerConfetti } from './confetti.js';
import { trigger3DShockwave } from './lunar-scene.js';
import { fetchCommunityFeedback, submitCommunityFeedback } from './api.js';

export async function loadFeedbackList() {
  const feedbackList = document.getElementById('feedback-list');
  const feedbackCountEl = document.getElementById('feedback-count');

  try {
    const data = await fetchCommunityFeedback();

    if (feedbackList) {
      feedbackList.innerHTML = '';
      if (!data || data.length === 0) {
        feedbackList.innerHTML = '<p class="text-muted text-center">No reviews yet. Be the first tester to leave feedback!</p>';
      } else {
        data.forEach(item => {
          const card = document.createElement('div');
          card.className = 'feedback-card';
          const stars = '⭐'.repeat(item.rating || 5);
          const timeStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent';

          card.innerHTML = `
            <div class="feedback-header">
              <span class="feedback-user"><i class="fa-solid fa-user-astronaut"></i> ${item.username}</span>
              <span class="feedback-category-badge">${item.category}</span>
            </div>
            <div class="stars">${stars}</div>
            <p class="feedback-body">${item.message}</p>
            <div class="feedback-footer">
              <span>Verified Preprod Tester</span>
              <span>${timeStr}</span>
            </div>
          `;
          feedbackList.appendChild(card);
        });
      }
    }

    if (feedbackCountEl) {
      feedbackCountEl.textContent = String(data ? data.length : 0);
    }
  } catch (e) {
    console.warn('Feedback load note:', e);
  }
}

export function initFeedbackModal({ showToast }) {
  const feedbackModal = document.getElementById('feedback-modal');
  const btnOpenFeedback = document.getElementById('btn-open-feedback-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCancelModal = document.getElementById('btn-cancel-modal');
  const feedbackForm = document.getElementById('feedback-form');

  function openModal() {
    playClickSound();
    if (feedbackModal) feedbackModal.classList.remove('hidden');
  }

  function closeModal() {
    if (feedbackModal) feedbackModal.classList.add('hidden');
  }

  if (btnOpenFeedback) btnOpenFeedback.addEventListener('click', openModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      playClickSound();

      const username = document.getElementById('fb-username')?.value.trim();
      const category = document.getElementById('fb-category')?.value;
      const rating = Number(document.getElementById('fb-rating')?.value);
      const message = document.getElementById('fb-message')?.value.trim();

      if (!message || !username) {
        showToast('Please fill out all fields');
        return;
      }

      try {
        const data = await submitCommunityFeedback({ username, category, rating, message });

        if (data.success) {
          playSuccessChime();
          showToast('Thank you! Feedback recorded on-chain.');
          closeModal();
          feedbackForm.reset();
          triggerConfetti();
          trigger3DShockwave(0x00f2fe);
          await loadFeedbackList();
        } else {
          showToast('Failed to post feedback');
        }
      } catch (err) {
        console.error(err);
        showToast('Network error posting feedback');
      }
    });
  }
}
