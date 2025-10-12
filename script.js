// ===========================
// Global Variables
// ===========================
let currentTextSize = 'normal';

// ===========================
// Navigation Functions
// ===========================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const sectionTop = section.offsetTop - navHeight - 20;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

// ===========================
// Text Size Adjustment
// ===========================
function adjustTextSize(action) {
    const body = document.body;
    
    // Remove existing size classes
    body.classList.remove('text-small', 'text-large', 'text-xlarge');
    
    switch(action) {
        case 'decrease':
            if (currentTextSize === 'normal') {
                body.classList.add('text-small');
                currentTextSize = 'small';
            } else if (currentTextSize === 'large') {
                currentTextSize = 'normal';
            } else if (currentTextSize === 'xlarge') {
                body.classList.add('text-large');
                currentTextSize = 'large';
            }
            break;
            
        case 'increase':
            if (currentTextSize === 'normal') {
                body.classList.add('text-large');
                currentTextSize = 'large';
            } else if (currentTextSize === 'small') {
                currentTextSize = 'normal';
            } else if (currentTextSize === 'large') {
                body.classList.add('text-xlarge');
                currentTextSize = 'xlarge';
            }
            break;
            
        case 'reset':
            currentTextSize = 'normal';
            break;
    }
}

// ===========================
// Example Categories Toggle
// ===========================
function toggleExample(categoryId) {
    const category = document.querySelector(`#${categoryId}`).parentElement;
    
    // Toggle active class
    category.classList.toggle('active');
}

// ===========================
// Playground - Tab Switching
// ===========================
function switchTab(tabName) {
    // Hide all tabs
    const allTabs = document.querySelectorAll('.playground-tab');
    const allContents = document.querySelectorAll('.playground-content');
    
    allTabs.forEach(tab => tab.classList.remove('active'));
    allContents.forEach(content => content.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = Array.from(allTabs).find(tab => 
        tab.textContent.toLowerCase().includes(tabName.toLowerCase())
    );
    const selectedContent = document.getElementById(tabName);
    
    if (selectedTab) selectedTab.classList.add('active');
    if (selectedContent) selectedContent.classList.add('active');
}

// ===========================
// Playground - Prompt Builder
// ===========================
function updatePrompt() {
    const goal = document.getElementById('goal')?.value || '';
    const context = document.getElementById('context')?.value || '';
    const requirements = document.getElementById('requirements')?.value || '';
    const format = document.getElementById('format')?.value || '';
    const audience = document.getElementById('audience')?.value || '';
    
    const generatedPrompt = document.getElementById('generatedPrompt');
    const copyBtn = document.getElementById('copyBtn');
    const qualitySection = document.getElementById('promptQuality');
    
    // Check if at least goal is filled
    if (!goal.trim()) {
        generatedPrompt.innerHTML = '<p class="placeholder">Fill in the fields on the left to generate your prompt...</p>';
        generatedPrompt.classList.remove('has-content');
        if (copyBtn) copyBtn.style.display = 'none';
        if (qualitySection) qualitySection.style.display = 'none';
        return;
    }
    
    // Build the prompt
    let prompt = goal;
    
    if (context.trim()) {
        prompt += `\n\nContext:\n${context}`;
    }
    
    if (requirements.trim()) {
        prompt += `\n\nRequirements:\n${requirements}`;
    }
    
    if (format) {
        prompt += `\n\nFormat: Please provide the response as ${format}.`;
    }
    
    if (audience) {
        prompt += `\n\nTarget audience: ${audience}`;
    }
    
    generatedPrompt.textContent = prompt;
    generatedPrompt.classList.add('has-content');
    
    if (copyBtn) copyBtn.style.display = 'block';
    
    // Calculate quality score
    calculatePromptQuality(goal, context, requirements, format, audience);
}

function calculatePromptQuality(goal, context, requirements, format, audience) {
    const qualitySection = document.getElementById('promptQuality');
    const qualityFill = document.getElementById('qualityFill');
    const qualityText = document.getElementById('qualityText');
    
    if (!qualitySection || !qualityFill || !qualityText) return;
    
    let score = 0;
    let maxScore = 100;
    let feedback = [];
    
    // Goal clarity (30 points)
    if (goal.trim().length > 20) {
        score += 30;
        feedback.push('✓ Clear goal specified');
    } else if (goal.trim().length > 0) {
        score += 15;
        feedback.push('⚠ Goal could be more specific');
    }
    
    // Context (25 points)
    if (context.trim().length > 50) {
        score += 25;
        feedback.push('✓ Detailed context provided');
    } else if (context.trim().length > 0) {
        score += 12;
        feedback.push('⚠ Context is brief, consider adding more details');
    } else {
        feedback.push('✗ No context provided');
    }
    
    // Requirements (20 points)
    if (requirements.trim().length > 30) {
        score += 20;
        feedback.push('✓ Requirements clearly specified');
    } else if (requirements.trim().length > 0) {
        score += 10;
        feedback.push('⚠ Requirements could be more detailed');
    } else {
        feedback.push('✗ No requirements specified');
    }
    
    // Format (15 points)
    if (format) {
        score += 15;
        feedback.push('✓ Output format specified');
    } else {
        feedback.push('✗ No output format specified');
    }
    
    // Audience (10 points)
    if (audience) {
        score += 10;
        feedback.push('✓ Target audience defined');
    } else {
        feedback.push('✗ No target audience specified');
    }
    
    // Update display
    qualitySection.style.display = 'block';
    qualityFill.style.width = score + '%';
    
    let rating = '';
    if (score >= 80) {
        rating = 'Excellent! This is a well-structured prompt.';
    } else if (score >= 60) {
        rating = 'Good! Your prompt is clear but could be improved.';
    } else if (score >= 40) {
        rating = 'Fair. Consider adding more details for better results.';
    } else {
        rating = 'Needs improvement. Add more context and requirements.';
    }
    
    qualityText.innerHTML = `<strong>Score: ${score}/100</strong><br>${rating}<br><br>${feedback.join('<br>')}`;
}

function copyPrompt() {
    const generatedPrompt = document.getElementById('generatedPrompt');
    const text = generatedPrompt.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const copyBtn = document.getElementById('copyBtn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        copyBtn.style.background = '#10b981';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
    }).catch(err => {
        alert('Failed to copy to clipboard');
        console.error('Copy failed:', err);
    });
}

// ===========================
// Playground - Prompt Analyzer
// ===========================
function analyzePrompt() {
    const input = document.getElementById('analyzerInput')?.value || '';
    const resultsDiv = document.getElementById('analysisResults');
    
    if (!input.trim()) {
        resultsDiv.innerHTML = '<p style="color: var(--text-light); text-align: center;">Please enter a prompt to analyze.</p>';
        return;
    }
    
    // Analyze the prompt
    const analysis = performPromptAnalysis(input);
    
    // Display results
    displayAnalysisResults(analysis, resultsDiv);
}

function performPromptAnalysis(prompt) {
    const analysis = {
        score: 0,
        strengths: [],
        weaknesses: [],
        suggestions: []
    };
    
    const length = prompt.length;
    const hasQuestionMark = prompt.includes('?');
    const hasContext = /context|background|situation|i am|i'm|i have/i.test(prompt);
    const hasRequirements = /require|need|must|should|include|format|length/i.test(prompt);
    const hasConstraints = /under|within|maximum|minimum|limit|budget|time/i.test(prompt);
    const hasRole = /you are|act as|as a|as an/i.test(prompt);
    const hasExamples = /example|for instance|such as|like/i.test(prompt);
    const hasFormat = /list|table|paragraph|step|bullet|code/i.test(prompt);
    const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = prompt.split(/\s+/).length;
    
    // Length analysis
    if (length > 100) {
        analysis.score += 15;
        analysis.strengths.push('Good length - provides detailed information');
    } else if (length > 50) {
        analysis.score += 10;
        analysis.suggestions.push('Consider adding more details for better results');
    } else {
        analysis.weaknesses.push('Prompt is too brief');
        analysis.suggestions.push('Add more context and requirements');
    }
    
    // Context check
    if (hasContext) {
        analysis.score += 20;
        analysis.strengths.push('Provides context or background information');
    } else {
        analysis.weaknesses.push('Missing contextual information');
        analysis.suggestions.push('Add background information about your situation or needs');
    }
    
    // Requirements check
    if (hasRequirements) {
        analysis.score += 20;
        analysis.strengths.push('Specifies requirements or constraints');
    } else {
        analysis.weaknesses.push('No clear requirements specified');
        analysis.suggestions.push('Specify what you need in the response');
    }
    
    // Format specification
    if (hasFormat) {
        analysis.score += 15;
        analysis.strengths.push('Specifies desired output format');
    } else {
        analysis.weaknesses.push('Output format not specified');
        analysis.suggestions.push('Specify how you want the response formatted (list, paragraph, etc.)');
    }
    
    // Role assignment
    if (hasRole) {
        analysis.score += 10;
        analysis.strengths.push('Uses role assignment technique');
    } else {
        analysis.suggestions.push('Consider assigning a specific role to the AI (e.g., "You are an expert in...")');
    }
    
    // Constraints
    if (hasConstraints) {
        analysis.score += 10;
        analysis.strengths.push('Includes specific constraints');
    } else {
        analysis.suggestions.push('Add relevant constraints (length, time, budget, complexity)');
    }
    
    // Examples
    if (hasExamples) {
        analysis.score += 10;
        analysis.strengths.push('Provides examples for guidance');
    }
    
    // Clarity check
    if (sentences.length > 1 && words > 20) {
        analysis.score += 10;
        analysis.strengths.push('Well-structured with multiple sentences');
    } else if (words < 10) {
        analysis.weaknesses.push('Too vague or unclear');
        analysis.suggestions.push('Break down your request into clear, specific points');
    }
    
    // Cap score at 100
    analysis.score = Math.min(analysis.score, 100);
    
    return analysis;
}

function displayAnalysisResults(analysis, container) {
    let scoreClass = 'poor';
    let scoreLabel = 'Needs Improvement';
    
    if (analysis.score >= 75) {
        scoreClass = 'good';
        scoreLabel = 'Excellent';
    } else if (analysis.score >= 50) {
        scoreClass = 'fair';
        scoreLabel = 'Good';
    }
    
    let html = `
        <div class="analysis-score">
            <div class="score-circle ${scoreClass}">${analysis.score}</div>
            <h3>${scoreLabel} Prompt</h3>
            <p>Your prompt scored ${analysis.score} out of 100</p>
        </div>
        
        <div class="analysis-feedback">
    `;
    
    // Strengths
    if (analysis.strengths.length > 0) {
        html += '<div class="feedback-item positive">';
        html += '<h4>✓ Strengths</h4>';
        html += '<ul>';
        analysis.strengths.forEach(strength => {
            html += `<li>${strength}</li>`;
        });
        html += '</ul></div>';
    }
    
    // Weaknesses
    if (analysis.weaknesses.length > 0) {
        html += '<div class="feedback-item negative">';
        html += '<h4>✗ Areas for Improvement</h4>';
        html += '<ul>';
        analysis.weaknesses.forEach(weakness => {
            html += `<li>${weakness}</li>`;
        });
        html += '</ul></div>';
    }
    
    // Suggestions
    if (analysis.suggestions.length > 0) {
        html += '<div class="feedback-item suggestion">';
        html += '<h4>💡 Suggestions</h4>';
        html += '<ul>';
        analysis.suggestions.forEach(suggestion => {
            html += `<li>${suggestion}</li>`;
        });
        html += '</ul></div>';
    }
    
    html += '</div>';
    
    container.innerHTML = html;
}

// ===========================
// Playground - Templates
// ===========================
const templates = {
    'code-review': `Review this [LANGUAGE] code for [PURPOSE]. 

Code:
[PASTE YOUR CODE HERE]

Please check for:
- Bugs and potential errors
- Performance issues
- Security vulnerabilities
- Best practices and code style
- Readability and maintainability

Provide specific suggestions for improvement with explanations.`,

    'content-writing': `Write a [LENGTH]-word [CONTENT TYPE] about [TOPIC] for [AUDIENCE].

Tone: [TONE - e.g., professional, casual, persuasive]

Structure:
- [SECTION 1]
- [SECTION 2]
- [SECTION 3]

Include:
- [REQUIREMENT 1]
- [REQUIREMENT 2]
- [REQUIREMENT 3]

SEO Keywords: [KEYWORD 1], [KEYWORD 2], [KEYWORD 3]`,

    'problem-solving': `I'm facing this problem: [DESCRIBE YOUR PROBLEM IN DETAIL]

Context:
- [RELEVANT BACKGROUND INFORMATION]
- [WHAT YOU'VE TRIED SO FAR]
- [CURRENT SITUATION]

Constraints:
- [LIMITATION 1 - e.g., budget, time, resources]
- [LIMITATION 2]
- [LIMITATION 3]

Please:
1. Analyze the problem step-by-step
2. Identify the root causes
3. Propose 3-5 potential solutions
4. For each solution, provide:
   - Description
   - Pros and cons
   - Implementation difficulty (1-10)
   - Expected outcome
5. Recommend the best approach with justification`,

    'learning': `Create a comprehensive learning plan for [SKILL/TOPIC].

My Background:
- Current level: [BEGINNER/INTERMEDIATE/ADVANCED]
- Relevant experience: [YOUR EXPERIENCE]
- Time available: [HOURS PER DAY/WEEK]
- Learning style: [VISUAL/HANDS-ON/READING/VIDEO]

Goal:
[WHAT YOU WANT TO ACHIEVE - BE SPECIFIC]

Timeline: [WEEKS/MONTHS]

Please include:
1. Week-by-week curriculum breakdown
2. Specific topics and concepts to cover
3. Recommended resources (prioritize free options)
4. Practice exercises for each stage
5. Milestone projects to build skills progressively
6. Common pitfalls to avoid
7. Methods to track progress
8. Tips for staying motivated`,

    'debugging': `I'm getting this error: [PASTE ERROR MESSAGE]

In my [LANGUAGE/FRAMEWORK] code.

What I'm trying to do:
[DESCRIBE YOUR GOAL]

Relevant code:
[PASTE YOUR CODE]

Environment:
- [LANGUAGE/FRAMEWORK VERSION]
- [OPERATING SYSTEM]
- [OTHER RELEVANT DETAILS]

What I've already tried:
- [ATTEMPT 1]
- [ATTEMPT 2]
- [ATTEMPT 3]

Please help me:
1. Understand what's causing the error
2. Explain why it's happening
3. Provide a solution with explanation
4. Suggest how to prevent this in the future`,

    'strategy': `Develop a [TIMEFRAME] strategy for [OBJECTIVE].

Current Situation:
- [DESCRIBE WHERE YOU ARE NOW]
- [KEY METRICS AND DATA]
- [RELEVANT BACKGROUND]

Target:
[WHAT YOU WANT TO ACHIEVE]

Resources Available:
- Budget: [AMOUNT]
- Team: [TEAM SIZE AND COMPOSITION]
- Assets: [EXISTING RESOURCES]
- Time: [TIMELINE]

Constraints:
- [LIMITATION 1]
- [LIMITATION 2]
- [LIMITATION 3]

Please provide:
1. Situation analysis (SWOT if applicable)
2. Strategic objectives (3-5 key goals)
3. Detailed tactics for each objective
4. Resource allocation plan
5. KPIs and success metrics
6. Risk assessment and mitigation strategies
7. Timeline with milestones
8. Quick wins for immediate implementation`
};

function copyTemplate(templateId) {
    const template = templates[templateId];
    
    if (!template) {
        alert('Template not found');
        return;
    }
    
    navigator.clipboard.writeText(template).then(() => {
        // Visual feedback
        const card = event.currentTarget;
        const originalBg = card.style.background;
        card.style.background = '#10b981';
        card.style.color = 'white';
        
        const originalHTML = card.innerHTML;
        card.innerHTML = '<div style="text-align: center; padding: 2rem;"><h4 style="color: white;">✓ Copied to Clipboard!</h4><p style="color: white;">Paste it into your AI chat</p></div>';
        
        setTimeout(() => {
            card.style.background = originalBg;
            card.style.color = '';
            card.innerHTML = originalHTML;
        }, 1500);
    }).catch(err => {
        alert('Failed to copy template to clipboard');
        console.error('Copy failed:', err);
    });
}

// ===========================
// Scroll Effects
// ===========================
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add shadow to navbar on scroll
    if (scrollTop > 10) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    } else {
        navbar.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
    }
    
    lastScrollTop = scrollTop;
});

// ===========================
// Keyboard Shortcuts
// ===========================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + = to increase text size
    if ((e.ctrlKey || e.metaKey) && e.key === '=') {
        e.preventDefault();
        adjustTextSize('increase');
    }
    
    // Ctrl/Cmd + - to decrease text size
    if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        adjustTextSize('decrease');
    }
    
    // Ctrl/Cmd + 0 to reset text size
    if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        adjustTextSize('reset');
    }
});

// ===========================
// Initialize on Load
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    console.log('PromptMaster application loaded successfully!');
    
    // Add smooth scroll to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const mobileMenu = document.getElementById('mobileMenu');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        
        if (mobileMenu && 
            mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !menuBtn.contains(e.target)) {
            toggleMobileMenu();
        }
    });
});

// ===========================
// Performance Optimization
// ===========================
// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to prompt update
const debouncedUpdatePrompt = debounce(updatePrompt, 300);

// Update event listeners to use debounced version
window.addEventListener('load', () => {
    const inputs = ['goal', 'context', 'requirements'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.removeAttribute('oninput');
            element.addEventListener('input', debouncedUpdatePrompt);
        }
    });
    
    ['format', 'audience'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.removeAttribute('onchange');
            element.addEventListener('change', updatePrompt);
        }
    });
});

// ===========================
// Progressive Enhancement
// ===========================
// Check for required browser features
if (!('clipboard' in navigator)) {
    console.warn('Clipboard API not supported. Copy functionality may be limited.');
}

// Add loading animation for long operations
function showLoading(element) {
    const loader = document.createElement('div');
    loader.className = 'loading-spinner';
    loader.innerHTML = '⏳ Processing...';
    element.appendChild(loader);
    return loader;
}

function hideLoading(loader) {
    if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader);
    }
}

// ===========================
// Analytics (Placeholder)
// ===========================
function trackEvent(category, action, label) {
    // Placeholder for analytics tracking
    // Integrate with Google Analytics, Plausible, or other analytics service
    console.log('Event tracked:', category, action, label);
}

// Track important user interactions
document.addEventListener('click', (e) => {
    if (e.target.matches('.nav-link')) {
        trackEvent('Navigation', 'Click', e.target.textContent);
    }
    if (e.target.matches('.cta-button')) {
        trackEvent('CTA', 'Click', 'Start Learning');
    }
    if (e.target.matches('.copy-btn')) {
        trackEvent('Playground', 'Copy Prompt', 'Prompt Builder');
    }
    if (e.target.matches('.analyze-btn')) {
        trackEvent('Playground', 'Analyze', 'Prompt Analyzer');
    }
});

