// Configuration - Your Render.io backend URL
const BACKEND_URL = 'https://gfgbq-team-syntaxnchill.onrender.com';
const API_ENDPOINT = `${BACKEND_URL}/verify`;

// Get DOM elements
const textInput = document.getElementById('text-input');
const verifyBtn = document.getElementById('verify-btn');
const resultsContainer = document.getElementById('results-container');
const errorContainer = document.getElementById('error-container');
const claimsList = document.getElementById('claims-list');
const apiStatusIndicator = document.getElementById('api-status');

// Initialize: Get selected text when popup opens
document.addEventListener('DOMContentLoaded', async () => {
  // Check backend status
  await checkBackendStatus();
  
  // Try to get selected text from active tab
  try {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    
    // Check if we can inject scripts into this tab
    if (tab.url && !tab.url.startsWith('about:') && !tab.url.startsWith('moz-extension:')) {
      const results = await browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: getSelectedTextFromPage
      });
      
      if (results && results[0] && results[0].result) {
        textInput.value = results[0].result;
      }
    }
  } catch (error) {
    console.log('Could not get selected text:', error);
  }
});

// Function to execute in page context
function getSelectedTextFromPage() {
  return window.getSelection().toString();
}

// Verify button click handler
verifyBtn.addEventListener('click', async () => {
  const text = textInput.value.trim();
  
  // Validation
  if (!text) {
    showError('Please paste or type some text to verify.');
    return;
  }
  
  if (text.length < 10) {
    showError('Please provide at least 10 characters of text.');
    return;
  }

  // Show loading state
  setLoading(true);
  clearResults();
  clearError();

  try {
    // Call backend API
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: text })
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    displayResults(data);

  } catch (error) {
    console.error('Verification error:', error);
    showError(`Failed to verify: ${error.message}. Is the backend running?`);
  } finally {
    setLoading(false);
  }
});

// Display results
function displayResults(data) {
  if (!data.results || data.results.length === 0) {
    showError('No claims found in the text.');
    return;
  }

  const results = data.results;
  
  // Calculate stats
  const verified = results.filter(r => r.status === 'VERIFIED').length;
  const hallucinated = results.filter(r => r.status === 'HALLUCINATED').length;
  const unverifiable = results.length - verified - hallucinated;
  
  const trustPercentage = results.length > 0 ? Math.round((verified / results.length) * 100) : 0;
  
  // Update trust meter
  document.getElementById('trust-score').textContent = `${trustPercentage}%`;
  document.getElementById('verified-count').textContent = verified;
  document.getElementById('hallucinated-count').textContent = hallucinated;
  document.getElementById('unverifiable-count').textContent = unverifiable;
  
  const trustFill = document.getElementById('trust-fill');
  trustFill.style.width = `${trustPercentage}%`;
  trustFill.className = `trust-fill ${
    trustPercentage >= 80 ? 'high' :
    trustPercentage >= 50 ? 'medium' :
    'low'
  }`;
  
  // Display individual claims
  claimsList.innerHTML = '';
  results.forEach((result, idx) => {
    const claimEl = document.createElement('div');
    claimEl.className = `claim claim-${result.status.toLowerCase()}`;
    
    const statusEmoji = 
      result.status === 'VERIFIED' ? '✅' :
      result.status === 'HALLUCINATED' ? '❌' :
      '❓';
    
    // Build sources HTML if available
    let sourcesHtml = '';
    if (result.sources && result.sources.length > 0) {
      const sourceItems = result.sources.map(src => {
        const title = src.title || src.url || 'Source';
        const url = src.url || src.link || '#';
        return `<li><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(title)}</a></li>`;
      }).join('');
      
      sourcesHtml = `
        <details class="claim-sources">
          <summary>Sources (${result.sources.length})</summary>
          <ul>${sourceItems}</ul>
        </details>
      `;
    }
    
    claimEl.innerHTML = `
      <div class="claim-header">
        <span class="claim-status">${statusEmoji} ${result.status}</span>
      </div>
      <p class="claim-text">${escapeHtml(result.claim)}</p>
      <p class="claim-reason">${escapeHtml(result.reason || '')}</p>
      ${sourcesHtml}
    `;
    
    claimsList.appendChild(claimEl);
  });
  
  resultsContainer.classList.remove('hidden');
}

// Show error message
function showError(message) {
  document.getElementById('error-text').textContent = message;
  errorContainer.classList.remove('hidden');
}

// Clear error message
function clearError() {
  errorContainer.classList.add('hidden');
}

// Clear results
function clearResults() {
  resultsContainer.classList.add('hidden');
  claimsList.innerHTML = '';
}

// Loading state
function setLoading(isLoading) {
  verifyBtn.disabled = isLoading;
  document.getElementById('btn-text').classList.toggle('hidden', isLoading);
  document.getElementById('spinner').classList.toggle('hidden', !isLoading);
}

// Check backend status
async function checkBackendStatus() {
  try {
    const response = await fetch(`${BACKEND_URL}/health`, { 
      method: 'GET',
      mode: 'cors'
    });
    if (response.ok) {
      apiStatusIndicator.textContent = '🟢 Connected';
      apiStatusIndicator.className = 'status-indicator connected';
    } else {
      apiStatusIndicator.textContent = '🔴 Error';
      apiStatusIndicator.className = 'status-indicator error';
    }
  } catch (error) {
    apiStatusIndicator.textContent = '🔴 Offline';
    apiStatusIndicator.className = 'status-indicator offline';
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
