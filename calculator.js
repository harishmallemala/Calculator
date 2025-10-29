class Calculator {
    constructor() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.history = [];

        this.currentDisplay = document.getElementById('currentDisplay');
        this.previousDisplay = document.getElementById('previousDisplay');

        this.initializeButtons();
        this.initializeKeyboard();
        this.initializeHistory();
    }

    initializeButtons() {
        // Number buttons
        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleNumber(button.dataset.number);
                this.addClickEffect(button);
            });
        });

        // Operator buttons
        document.querySelectorAll('[data-operator]').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleOperator(button.dataset.operator);
                this.addClickEffect(button);
                this.highlightOperator(button);
            });
        });

        // Action buttons
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleAction(button.dataset.action);
                this.addClickEffect(button);
            });
        });
    }

    initializeKeyboard() {
        document.addEventListener('keydown', (e) => {
            // Numbers and decimal
            if (e.key >= '0' && e.key <= '9' || e.key === '.') {
                this.handleNumber(e.key);
                this.highlightButton(`[data-number="${e.key}"]`);
            }

            // Operators
            if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
                this.handleOperator(e.key);
                this.highlightButton(`[data-operator="${e.key}"]`);
            }

            // Enter or equals
            if (e.key === 'Enter' || e.key === '=') {
                e.preventDefault();
                this.handleAction('equals');
                this.highlightButton('[data-action="equals"]');
            }

            // Escape or C
            if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
                this.handleAction('clear');
                this.highlightButton('[data-action="clear"]');
            }

            // Backspace or Delete
            if (e.key === 'Backspace' || e.key === 'Delete') {
                this.handleAction('delete');
                this.highlightButton('[data-action="delete"]');
            }

            // Percent
            if (e.key === '%') {
                this.handleAction('percent');
                this.highlightButton('[data-action="percent"]');
            }
        });
    }

    async initializeHistory() {
        const historyPanel = document.createElement('div');
        historyPanel.classList.add('history-panel');
        this.historyPanel = historyPanel;

        const historyContent = document.createElement('div');
        historyContent.classList.add('history-content');
        this.historyContent = historyContent;

        const clearButton = document.createElement('div');
        clearButton.classList.add('history-clear');
        clearButton.textContent = 'Clear History';
        clearButton.addEventListener('click', () => this.clearHistory());

        historyPanel.appendChild(historyContent);
        historyPanel.appendChild(clearButton);

        document.querySelector('.calculator-container').appendChild(historyPanel);

        // Load history from Supabase
        await this.loadHistoryFromDB();
    }

    handleNumber(num) {
        // Prevent multiple decimal points
        if (num === '.' && this.currentValue.includes('.')) return;

        if (this.shouldResetDisplay) {
            this.currentValue = num === '.' ? '0.' : num;
            this.shouldResetDisplay = false;
        } else {
            if (this.currentValue === '0' && num !== '.') {
                this.currentValue = num;
            } else {
                this.currentValue += num;
            }
        }

        this.updateDisplay();
    }

    handleOperator(operator) {
        if (this.operation !== null && !this.shouldResetDisplay) {
            this.calculate();
        }

        this.operation = operator;
        this.previousValue = this.currentValue;
        this.shouldResetDisplay = true;

        this.updatePreviousDisplay();
        this.removeOperatorHighlight();
    }

    handleAction(action) {
        switch(action) {
            case 'clear':
                this.clear();
                break;
            case 'delete':
                this.delete();
                break;
            case 'percent':
                this.percent();
                break;
            case 'equals':
                this.calculate();
                break;
            case 'history':
                this.toggleHistory();
                break;
        }
    }

    calculate() {
        if (this.operation === null || this.shouldResetDisplay) return;

        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);

        if (isNaN(prev) || isNaN(current)) return;

        let result;
        switch(this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.showError();
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        // Format result to avoid floating point issues
        result = Math.round(result * 100000000) / 100000000;

        // Limit decimal places for display
        if (result.toString().length > 12) {
            result = parseFloat(result.toPrecision(12));
        }

        const calculation = `${this.previousValue} ${this.getOperatorSymbol(this.operation)} ${this.currentValue} = ${result}`;
        this.addToHistory(calculation);

        this.currentValue = result.toString();
        this.operation = null;
        this.previousValue = '';
        this.shouldResetDisplay = true;

        this.updateDisplay();
        this.updatePreviousDisplay();
        this.removeOperatorHighlight();

        // Add subtle calculation animation
        this.animateResult();
    }

    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;

        this.updateDisplay();
        this.updatePreviousDisplay();
        this.removeOperatorHighlight();
    }

    delete() {
        if (this.shouldResetDisplay) return;

        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }

        this.updateDisplay();
    }

    percent() {
        const current = parseFloat(this.currentValue);
        if (isNaN(current)) return;

        this.currentValue = (current / 100).toString();
        this.updateDisplay();
    }

    updateDisplay() {
        this.currentDisplay.textContent = this.currentValue;
    }

    updatePreviousDisplay() {
        if (this.operation && this.previousValue) {
            const operatorSymbol = this.getOperatorSymbol(this.operation);
            this.previousDisplay.textContent = `${this.previousValue} ${operatorSymbol}`;
        } else {
            this.previousDisplay.textContent = '';
        }
    }

    getOperatorSymbol(operator) {
        const symbols = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷'
        };
        return symbols[operator] || operator;
    }

    showError() {
        this.currentValue = 'Error';
        this.updateDisplay();

        setTimeout(() => {
            this.clear();
        }, 1500);
    }

    addClickEffect(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 100);
    }

    highlightButton(selector) {
        const button = document.querySelector(selector);
        if (button) {
            this.addClickEffect(button);
        }
    }

    highlightOperator(button) {
        this.removeOperatorHighlight();
        button.classList.add('active');
    }

    removeOperatorHighlight() {
        document.querySelectorAll('.btn-operator').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    animateResult() {
        this.currentDisplay.style.transform = 'scale(1.05)';
        this.currentDisplay.style.transition = 'transform 0.2s ease-out';

        setTimeout(() => {
            this.currentDisplay.style.transform = 'scale(1)';
        }, 200);
    }

    toggleHistory() {
        this.historyPanel.classList.toggle('show');
    }

    async addToHistory(calculation) {
        this.history.unshift(calculation);
        if (this.history.length > 20) {
            this.history.pop();
        }
        this.renderHistory();

        // Save to Supabase
        await this.saveHistoryToDB(calculation);
    }

    renderHistory() {
        this.historyContent.innerHTML = '';
        this.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');
            historyItem.textContent = item;
            this.historyContent.appendChild(historyItem);
        });
    }

    async clearHistory() {
        this.history = [];
        this.renderHistory();

        // Clear from Supabase
        await this.clearHistoryFromDB();
    }

    // Supabase integration methods
    async saveHistoryToDB(calculation) {
        if (!window.supabaseClient) {
            console.warn('Supabase not configured');
            return;
        }

        try {
            const { data, error } = await window.supabaseClient
                .from('calculator_history')
                .insert([
                    {
                        calculation: calculation,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) throw error;
        } catch (error) {
            console.error('Error saving to Supabase:', error);
        }
    }

    async loadHistoryFromDB() {
        if (!window.supabaseClient) {
            console.warn('Supabase not configured');
            return;
        }

        try {
            const { data, error } = await window.supabaseClient
                .from('calculator_history')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;

            if (data && data.length > 0) {
                this.history = data.map(item => item.calculation);
                this.renderHistory();
            }
        } catch (error) {
            console.error('Error loading from Supabase:', error);
        }
    }

    async clearHistoryFromDB() {
        if (!window.supabaseClient) {
            console.warn('Supabase not configured');
            return;
        }

        try {
            const { error } = await window.supabaseClient
                .from('calculator_history')
                .delete()
                .neq('id', 0); // Delete all records

            if (error) throw error;
        } catch (error) {
            console.error('Error clearing from Supabase:', error);
        }
    }
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator();

    // Add subtle hover sound effect (visual feedback)
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', () => {
            if (window.matchMedia('(hover: hover)').matches) {
                button.style.transition = 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        });
    });
});
