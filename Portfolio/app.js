document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Scroll Reveal Animations using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                
                // Optional: Counter animation for numbers when they come into view
                const counters = entry.target.querySelectorAll('.count');
                if(counters.length > 0) {
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const duration = 2000; // ms
                        const stepTime = Math.abs(Math.floor(duration / target));
                        let current = 0;
                        
                        const increment = () => {
                            current += Math.ceil(target / 50); // fast increment
                            if (current > target) current = target;
                            counter.innerText = current;
                            if (current < target) {
                                setTimeout(increment, stepTime);
                            }
                        };
                        increment();
                        // Prevent running animation multiple times
                        counter.classList.remove('count'); 
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 2. Back to Top Button
    const backToTopBtn = document.getElementById("backToTop");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // 3. Smooth Anchor Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetEl = document.querySelector(targetId);
            if(targetEl) {
                targetEl.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Form Submission Handling (Mock behavior for interactivity)
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector(".submit-btn");
            const originalHTML = btn.innerHTML;
            
            // Show Success Checkmark
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.style.color = "#4CAF50"; // Green color
            btn.style.transform = "scale(1.2)";
            
            // Reset form and button after 3 seconds
            setTimeout(() => {
                contactForm.reset();
                btn.innerHTML = originalHTML;
                btn.style.color = "var(--primary-color)";
                btn.style.transform = "scale(1)";
            }, 3000);
        });
    }

    // 5. Testimonial Slider Interactive Logic
    const dots = document.querySelectorAll(".slider-dots .dot");
    const quoteText = document.querySelector(".testimonial-content blockquote");
    const authorName = document.querySelector(".testimonial-content .author h4");
    const authorRole = document.querySelector(".testimonial-content .author span");
    const fadeElements = document.querySelectorAll(".fade-text");

    // Mock data for slider
    const testimonials = [
        {
            text: "Amazing! At vero eos et accu samus et iusto odio dignissimosan ducimus qui blan ditiis praesen tium volup capaten nise no kamani kuc kuc hotahe!",
            name: "Jared Warner",
            role: "CEO of BeServer"
        },
        {
            text: "Carlos delivered an outstanding product well before the deadline. His attention to detail and design aesthetics are top-notch. Highly recommended for any web project.",
            name: "Sarah Jenkins",
            role: "Product Manager"
        },
        {
            text: "The web app was built flawlessly. Our conversion rates increased by 40% after the redesign. An absolute pleasure to work with.",
            name: "Michael Chen",
            role: "Startup Founder"
        },
        {
            text: "Extremely responsive and talented. Carlos transformed our messy ideas into a coherent, beautiful digital experience. Will definitely work with him again.",
            name: "Elena Rodriguez",
            role: "Creative Director"
        }
    ];

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            if(dot.classList.contains('active')) return;

            // Remove active from all dots
            dots.forEach(d => d.classList.remove("active"));
            // Add active to clicked dot
            dot.classList.add("active");

            // Fade out current text
            fadeElements.forEach(el => {
                el.style.opacity = 0;
                el.style.transform = "translateY(10px)";
            });

            // Wait for fade out, change text, then fade back in
            setTimeout(() => {
                quoteText.textContent = testimonials[index].text;
                authorName.textContent = testimonials[index].name;
                authorRole.textContent = testimonials[index].role;
                
                // Fade back in
                fadeElements.forEach(el => {
                    el.style.opacity = 1;
                    el.style.transform = "translateY(0)";
                });
            }, 300); 
        });
    });
});
