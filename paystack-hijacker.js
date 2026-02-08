/**
 * ========================================================================================
 * PAYSTACK CHECKOUT HIJACKER SCRIPT
 * ========================================================================================
 * 
 * Purpose: Intercepts all checkout/purchase buttons and redirects to Paystack
 * Method: DOM Interception using MutationObserver
 * Compatibility: Works with React/Next.js dynamic rendering
 * 
 * INSTALLATION: Paste this entire <script> block into your index.html <head> section
 * ========================================================================================
 */

(function() {
    'use strict';
    
    // ==================== CONFIGURATION ====================
    const CONFIG = {
        // Your Paystack checkout URL (replace this with your actual URL)
        paystackURL: 'https://your-paystack-checkout-url.com',
        
        // Button text patterns to match (case-insensitive)
        buttonTextPatterns: [
            'checkout',
            'buy now',
            'purchase',
            'buy ticket',
            'complete order',
            'proceed to checkout',
            'place order'
        ],
        
        // CSS selectors for checkout buttons (backup detection method)
        buttonSelectors: [
            'button[aria-label*="checkout" i]',
            'button[class*="checkout" i]',
            'a[href*="checkout"]',
            'button[type="submit"]'
        ],
        
        // Enable debug logging
        debug: true
    };
    
    // ==================== UTILITIES ====================
    const logger = {
        log: (...args) => CONFIG.debug && console.log('[Paystack Hijacker]', ...args),
        warn: (...args) => CONFIG.debug && console.warn('[Paystack Hijacker]', ...args),
        error: (...args) => console.error('[Paystack Hijacker]', ...args)
    };
    
    // Track hijacked buttons to avoid duplicate listeners
    const hijackedButtons = new WeakSet();
    
    // ==================== CART DATA EXTRACTION ====================
    /**
     * Attempts to extract cart total from the DOM
     */
    function extractCartTotal() {
        const totalSelectors = [
            '[class*="total" i]',
            '[class*="price" i]',
            '[id*="total" i]',
            '[data-testid*="total" i]'
        ];
        
        for (const selector of totalSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
                const text = el.textContent;
                // Look for currency patterns like KES 1,500 or $100.00
                const match = text.match(/(?:KES|USD|\$|Ksh)?\s*([\d,]+\.?\d*)/i);
                if (match) {
                    const amount = match[1].replace(/,/g, '');
                    if (parseFloat(amount) > 0) {
                        logger.log('Extracted cart total:', amount);
                        return amount;
                    }
                }
            }
        }
        
        logger.warn('Could not extract cart total from DOM');
        return null;
    }
    
    /**
     * Builds Paystack URL with amount parameter
     */
    function buildPaystackURL() {
        const total = extractCartTotal();
        let url = CONFIG.paystackURL;
        
        if (total) {
            // Add amount as query parameter
            const separator = url.includes('?') ? '&' : '?';
            url += `${separator}amount=${total}`;
        }
        
        return url;
    }
    
    // ==================== BUTTON DETECTION ====================
    /**
     * Checks if a button should be hijacked
     */
    function isCheckoutButton(element) {
        if (!element || !element.textContent) return false;
        
        const text = element.textContent.trim().toLowerCase();
        
        // Check text patterns
        for (const pattern of CONFIG.buttonTextPatterns) {
            if (text.includes(pattern.toLowerCase())) {
                return true;
            }
        }
        
        // Check attributes
        const ariaLabel = (element.getAttribute('aria-label') || '').toLowerCase();
        const className = (element.getAttribute('class') || '').toLowerCase();
        const href = (element.getAttribute('href') || '').toLowerCase();
        
        return ariaLabel.includes('checkout') || 
               className.includes('checkout') ||
               href.includes('checkout');
    }
    
    /**
     * Hijacks a button's click event
     */
    function hijackButton(button) {
        // Skip if already hijacked
        if (hijackedButtons.has(button)) {
            return;
        }
        
        logger.log('Hijacking button:', button.textContent.trim());
        
        // Create the hijacker function
        const hijacker = function(event) {
            logger.log('🚫 Intercepted checkout click!');
            
            // STOP the original event from firing
            event.preventDefault();
            event.stopImmediatePropagation();
            event.stopPropagation();
            
            // Build Paystack URL with cart data
            const paystackURL = buildPaystackURL();
            
            logger.log('✅ Redirecting to Paystack:', paystackURL);
            
            // Small delay to ensure logging is visible
            setTimeout(() => {
                window.location.href = paystackURL;
            }, 100);
        };
        
        // Add listener with capture phase to intercept before React
        button.addEventListener('click', hijacker, { capture: true });
        
        // Mark as hijacked
        hijackedButtons.add(button);
        
        logger.log('✅ Button hijacked successfully');
    }
    
    // ==================== DOM SCANNING ====================
    /**
     * Scans the entire document for checkout buttons
     */
    function scanForCheckoutButtons() {
        logger.log('Scanning for checkout buttons...');
        
        let foundCount = 0;
        
        // Method 1: Find by text content
        const allButtons = document.querySelectorAll('button, a[role="button"], input[type="submit"]');
        
        allButtons.forEach(button => {
            if (isCheckoutButton(button)) {
                hijackButton(button);
                foundCount++;
            }
        });
        
        // Method 2: Find by CSS selectors
        CONFIG.buttonSelectors.forEach(selector => {
            try {
                const buttons = document.querySelectorAll(selector);
                buttons.forEach(button => {
                    if (!hijackedButtons.has(button)) {
                        hijackButton(button);
                        foundCount++;
                    }
                });
            } catch (e) {
                logger.warn('Invalid selector:', selector);
            }
        });
        
        if (foundCount > 0) {
            logger.log(`✅ Found and hijacked ${foundCount} button(s)`);
        }
    }
    
    // ==================== MUTATION OBSERVER ====================
    /**
     * Watches for DOM changes and hijacks new buttons as they appear
     */
    function startObserver() {
        logger.log('Starting MutationObserver...');
        
        const observer = new MutationObserver((mutations) => {
            let needsScan = false;
            
            for (const mutation of mutations) {
                // Check if any buttons were added
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // Element node
                            // Check if the node itself is a button
                            if (node.matches && node.matches('button, a[role="button"], input[type="submit"]')) {
                                needsScan = true;
                                break;
                            }
                            // Check if the node contains buttons
                            if (node.querySelector && node.querySelector('button, a[role="button"], input[type="submit"]')) {
                                needsScan = true;
                                break;
                            }
                        }
                    }
                }
                
                if (needsScan) break;
            }
            
            if (needsScan) {
                logger.log('DOM changed, re-scanning...');
                scanForCheckoutButtons();
            }
        });
        
        // Observe the entire document body
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });
        
        logger.log('✅ MutationObserver started');
        
        return observer;
    }
    
    // ==================== INITIALIZATION ====================
    /**
     * Initialize the hijacker
     */
    function init() {
        logger.log('🚀 Initializing Paystack Checkout Hijacker...');
        
        // Validate configuration
        if (CONFIG.paystackURL === 'https://your-paystack-checkout-url.com') {
            logger.error('❌ ERROR: Please configure your Paystack URL in the CONFIG object!');
            logger.error('Update this line: paystackURL: "YOUR_ACTUAL_PAYSTACK_URL"');
            return;
        }
        
        // Initial scan
        scanForCheckoutButtons();
        
        // Start observing for dynamic changes
        startObserver();
        
        // Re-scan periodically as backup (in case observer misses something)
        setInterval(scanForCheckoutButtons, 2000);
        
        logger.log('✅ Paystack Checkout Hijacker is active!');
    }
    
    // ==================== START ====================
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Also re-initialize when Next.js navigation happens
    window.addEventListener('popstate', () => {
        logger.log('Navigation detected, re-scanning...');
        setTimeout(scanForCheckoutButtons, 500);
    });
    
    // Expose configuration for easy updates (open browser console and type: PaystackHijacker.setURL("new-url"))
    window.PaystackHijacker = {
        setURL: function(newURL) {
            CONFIG.paystackURL = newURL;
            logger.log('Paystack URL updated to:', newURL);
        },
        enableDebug: function() {
            CONFIG.debug = true;
            logger.log('Debug logging enabled');
        },
        disableDebug: function() {
            CONFIG.debug = false;
        },
        scan: scanForCheckoutButtons
    };
    
})();
