document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    });

    // Toggle sidebar on mobile
    document.getElementById('sidebarToggle')?.addEventListener('click', function() {
        document.body.classList.toggle('sidebar-toggled');
        document.querySelector('.sidebar').classList.toggle('toggled');
    });

    // Auto-generate slugs from title inputs
    const titleInputs = document.querySelectorAll('.slug-source');
    titleInputs.forEach(input => {
        input.addEventListener('input', function() {
            const slugField = document.querySelector('.slug-target');
            if (slugField) {
                slugField.value = generateSlug(this.value);
            }
        });
    });

    // Function to generate slug from text
    function generateSlug(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    }

    // Automation toggle handlers
    const automationToggles = document.querySelectorAll('.automation-toggle');
    automationToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const targetId = this.dataset.target;
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                if (this.checked) {
                    targetElement.classList.remove('d-none');
                } else {
                    targetElement.classList.add('d-none');
                }
            }
        });
    });

    // Content template generator
    const generateTemplateBtn = document.getElementById('generate-template');
    if (generateTemplateBtn) {
        generateTemplateBtn.addEventListener('click', function() {
            const affiliateId = document.getElementById('affiliate-select').value;
            const platform = document.getElementById('platform-select').value;
            const templateType = document.getElementById('template-type-select').value;
            
            if (!affiliateId || !platform || !templateType) {
                alert('Bitte wählen Sie einen Affiliate, eine Plattform und einen Vorlagentyp aus.');
                return;
            }
            
            // In a real implementation, this would make an API call to generate content
            // For now, we'll just show a placeholder
            const contentArea = document.getElementById('content-template-area');
            contentArea.value = `Hier ist ein automatisch generierter ${templateType} Post für die ${platform} Plattform.\n\nDieser Inhalt würde auf Basis der Affiliate-Daten und der ausgewählten Plattform erstellt werden.\n\n#hashtag #menschgreifzu #affiliate`;
        });
    }

    // Batch scheduling handler
    const batchScheduleBtn = document.getElementById('batch-schedule-btn');
    if (batchScheduleBtn) {
        batchScheduleBtn.addEventListener('click', function() {
            const affiliateIds = Array.from(document.querySelectorAll('#affiliate-batch-select option:checked')).map(option => option.value);
            const platforms = Array.from(document.querySelectorAll('#platform-batch-select option:checked')).map(option => option.value);
            const startDate = document.getElementById('batch-start-date').value;
            const frequency = document.getElementById('batch-frequency').value;
            
            if (affiliateIds.length === 0 || platforms.length === 0 || !startDate || !frequency) {
                alert('Bitte füllen Sie alle erforderlichen Felder aus.');
                return;
            }
            
            // Show success message (in a real implementation, this would make API calls)
            const resultArea = document.getElementById('batch-result');
            resultArea.innerHTML = `
                <div class="alert alert-success">
                    <strong>Erfolg!</strong> ${affiliateIds.length * platforms.length} Posts wurden für ${affiliateIds.length} Affiliates auf ${platforms.length} Plattformen geplant.
                    <br>Startdatum: ${startDate}
                    <br>Frequenz: ${frequency}
                </div>
            `;
        });
    }

    // Landing page template selector
    const templateSelector = document.getElementById('landing-page-template');
    if (templateSelector) {
        templateSelector.addEventListener('change', function() {
            const templateId = this.value;
            if (templateId) {
                // In a real implementation, this would fetch the template content
                document.getElementById('landing-page-content').value = `Dies ist der Inhalt der Vorlage ${templateId}.\n\nHier würden alle HTML-Elemente und Platzhalter für die Landingpage angezeigt werden.`;
            }
        });
    }
});
