/**
 * i18n Service
 * Çoklu dil desteği
 * Türkçe, İngilizce, Almanca
 */
import { Injectable, signal, computed } from '@angular/core';

export type Language = 'tr' | 'en' | 'de';

export interface Translations {
    [key: string]: string;
}

const translations: Record<Language, Translations> = {
    tr: {
        // App
        'app.title': 'Hesap Makinesi',
        'app.subtitle': 'PRO',
        'app.version': 'v2.0',
        'app.footer': 'Angular 19 • Material Design 3 • PWA Ready',
        'app.install': 'Uygulamayı Yükle',
        'app.lightTheme': 'Açık Tema',
        'app.darkTheme': 'Koyu Tema',

        // Tabs
        'tab.standard': 'Standart',
        'tab.scientific': 'Bilimsel',
        'tab.advanced': 'Gelişmiş',
        'tab.programmer': 'Programcı',
        'tab.financial': 'Finans',
        'tab.unit': 'Birim',
        'tab.graph': 'Grafik',

        // Standard Calculator
        'calc.clear': 'Temizle',
        'calc.clearEntry': 'Girişi Temizle',
        'calc.backspace': 'Geri Al',
        'calc.equals': 'Eşittir',
        'calc.add': 'Topla',
        'calc.subtract': 'Çıkar',
        'calc.multiply': 'Çarp',
        'calc.divide': 'Böl',
        'calc.percent': 'Yüzde',
        'calc.negate': 'İşaret Değiştir',

        // Memory
        'memory.clear': 'Hafıza Temizle',
        'memory.recall': 'Hafızadan Çağır',
        'memory.add': 'Hafızaya Ekle',
        'memory.subtract': 'Hafızadan Çıkar',

        // Scientific
        'sci.degrees': 'Derece',
        'sci.radians': 'Radyan',
        'sci.sin': 'Sinüs',
        'sci.cos': 'Kosinüs',
        'sci.tan': 'Tanjant',
        'sci.log': 'Logaritma',
        'sci.ln': 'Doğal Logaritma',
        'sci.sqrt': 'Karekök',
        'sci.factorial': 'Faktöriyel',
        'sci.power': 'Üs',
        'sci.pi': 'Pi',
        'sci.e': 'Euler Sayısı',

        // Programmer
        'prog.binary': 'İkili',
        'prog.octal': 'Sekizli',
        'prog.decimal': 'Onluk',
        'prog.hex': 'Onaltılık',
        'prog.and': 'VE',
        'prog.or': 'VEYA',
        'prog.xor': 'ÖZEL VEYA',
        'prog.not': 'DEĞİL',
        'prog.leftShift': 'Sola Kaydır',
        'prog.rightShift': 'Sağa Kaydır',

        // Financial
        'fin.loan': 'Kredi',
        'fin.compound': 'Bileşik Faiz',
        'fin.sip': 'Düzenli Yatırım',
        'fin.fd': 'Vadeli Mevduat',
        'fin.loanAmount': 'Kredi Tutarı',
        'fin.interestRate': 'Faiz Oranı',
        'fin.term': 'Vade',
        'fin.emi': 'Aylık Taksit',
        'fin.totalPayment': 'Toplam Ödeme',
        'fin.totalInterest': 'Toplam Faiz',

        // Unit Converter
        'unit.length': 'Uzunluk',
        'unit.weight': 'Ağırlık',
        'unit.temperature': 'Sıcaklık',
        'unit.volume': 'Hacim',
        'unit.area': 'Alan',
        'unit.data': 'Veri',
        'unit.speed': 'Hız',
        'unit.time': 'Zaman',

        // Graph
        'graph.addFunction': 'Fonksiyon Ekle',
        'graph.presets': 'Hazır Fonksiyonlar',
        'graph.zoomIn': 'Yakınlaştır',
        'graph.zoomOut': 'Uzaklaştır',
        'graph.reset': 'Görünümü Sıfırla',

        // History
        'history.title': 'Geçmiş',
        'history.clear': 'Geçmişi Temizle',
        'history.empty': 'Henüz hesaplama yok',

        // Errors
        'error.divisionByZero': 'Sıfıra bölme hatası',
        'error.invalidExpression': 'Geçersiz ifade',
        'error.overflow': 'Sayı çok büyük'
    },

    en: {
        // App
        'app.title': 'Calculator',
        'app.subtitle': 'PRO',
        'app.version': 'v2.0',
        'app.footer': 'Angular 19 • Material Design 3 • PWA Ready',
        'app.install': 'Install App',
        'app.lightTheme': 'Light Theme',
        'app.darkTheme': 'Dark Theme',

        // Tabs
        'tab.standard': 'Standard',
        'tab.scientific': 'Scientific',
        'tab.advanced': 'Advanced',
        'tab.programmer': 'Programmer',
        'tab.financial': 'Financial',
        'tab.unit': 'Unit',
        'tab.graph': 'Graph',

        // Standard Calculator
        'calc.clear': 'Clear',
        'calc.clearEntry': 'Clear Entry',
        'calc.backspace': 'Backspace',
        'calc.equals': 'Equals',
        'calc.add': 'Add',
        'calc.subtract': 'Subtract',
        'calc.multiply': 'Multiply',
        'calc.divide': 'Divide',
        'calc.percent': 'Percent',
        'calc.negate': 'Negate',

        // Memory
        'memory.clear': 'Memory Clear',
        'memory.recall': 'Memory Recall',
        'memory.add': 'Memory Add',
        'memory.subtract': 'Memory Subtract',

        // Scientific
        'sci.degrees': 'Degrees',
        'sci.radians': 'Radians',
        'sci.sin': 'Sine',
        'sci.cos': 'Cosine',
        'sci.tan': 'Tangent',
        'sci.log': 'Logarithm',
        'sci.ln': 'Natural Log',
        'sci.sqrt': 'Square Root',
        'sci.factorial': 'Factorial',
        'sci.power': 'Power',
        'sci.pi': 'Pi',
        'sci.e': 'Euler Number',

        // Programmer
        'prog.binary': 'Binary',
        'prog.octal': 'Octal',
        'prog.decimal': 'Decimal',
        'prog.hex': 'Hexadecimal',
        'prog.and': 'AND',
        'prog.or': 'OR',
        'prog.xor': 'XOR',
        'prog.not': 'NOT',
        'prog.leftShift': 'Left Shift',
        'prog.rightShift': 'Right Shift',

        // Financial
        'fin.loan': 'Loan',
        'fin.compound': 'Compound Interest',
        'fin.sip': 'SIP',
        'fin.fd': 'Fixed Deposit',
        'fin.loanAmount': 'Loan Amount',
        'fin.interestRate': 'Interest Rate',
        'fin.term': 'Term',
        'fin.emi': 'Monthly EMI',
        'fin.totalPayment': 'Total Payment',
        'fin.totalInterest': 'Total Interest',

        // Unit Converter
        'unit.length': 'Length',
        'unit.weight': 'Weight',
        'unit.temperature': 'Temperature',
        'unit.volume': 'Volume',
        'unit.area': 'Area',
        'unit.data': 'Data',
        'unit.speed': 'Speed',
        'unit.time': 'Time',

        // Graph
        'graph.addFunction': 'Add Function',
        'graph.presets': 'Preset Functions',
        'graph.zoomIn': 'Zoom In',
        'graph.zoomOut': 'Zoom Out',
        'graph.reset': 'Reset View',

        // History
        'history.title': 'History',
        'history.clear': 'Clear History',
        'history.empty': 'No calculations yet',

        // Errors
        'error.divisionByZero': 'Division by zero',
        'error.invalidExpression': 'Invalid expression',
        'error.overflow': 'Number too large'
    },

    de: {
        // App
        'app.title': 'Taschenrechner',
        'app.subtitle': 'PRO',
        'app.version': 'v2.0',
        'app.footer': 'Angular 19 • Material Design 3 • PWA Ready',
        'app.install': 'App Installieren',
        'app.lightTheme': 'Helles Thema',
        'app.darkTheme': 'Dunkles Thema',

        // Tabs
        'tab.standard': 'Standard',
        'tab.scientific': 'Wissenschaftlich',
        'tab.advanced': 'Erweitert',
        'tab.programmer': 'Programmierer',
        'tab.financial': 'Finanzen',
        'tab.unit': 'Einheiten',
        'tab.graph': 'Grafik',

        // Standard Calculator
        'calc.clear': 'Löschen',
        'calc.clearEntry': 'Eingabe Löschen',
        'calc.backspace': 'Rücktaste',
        'calc.equals': 'Gleich',
        'calc.add': 'Addieren',
        'calc.subtract': 'Subtrahieren',
        'calc.multiply': 'Multiplizieren',
        'calc.divide': 'Dividieren',
        'calc.percent': 'Prozent',
        'calc.negate': 'Vorzeichen',

        // Memory
        'memory.clear': 'Speicher Löschen',
        'memory.recall': 'Speicher Abrufen',
        'memory.add': 'Zum Speicher Addieren',
        'memory.subtract': 'Vom Speicher Subtrahieren',

        // Scientific
        'sci.degrees': 'Grad',
        'sci.radians': 'Radiant',
        'sci.sin': 'Sinus',
        'sci.cos': 'Kosinus',
        'sci.tan': 'Tangens',
        'sci.log': 'Logarithmus',
        'sci.ln': 'Natürlicher Log',
        'sci.sqrt': 'Quadratwurzel',
        'sci.factorial': 'Fakultät',
        'sci.power': 'Potenz',
        'sci.pi': 'Pi',
        'sci.e': 'Euler-Zahl',

        // Programmer
        'prog.binary': 'Binär',
        'prog.octal': 'Oktal',
        'prog.decimal': 'Dezimal',
        'prog.hex': 'Hexadezimal',
        'prog.and': 'UND',
        'prog.or': 'ODER',
        'prog.xor': 'EXKLUSIV ODER',
        'prog.not': 'NICHT',
        'prog.leftShift': 'Links Verschieben',
        'prog.rightShift': 'Rechts Verschieben',

        // Financial
        'fin.loan': 'Darlehen',
        'fin.compound': 'Zinseszins',
        'fin.sip': 'Sparplan',
        'fin.fd': 'Festgeld',
        'fin.loanAmount': 'Darlehensbetrag',
        'fin.interestRate': 'Zinssatz',
        'fin.term': 'Laufzeit',
        'fin.emi': 'Monatliche Rate',
        'fin.totalPayment': 'Gesamtzahlung',
        'fin.totalInterest': 'Gesamtzinsen',

        // Unit Converter
        'unit.length': 'Länge',
        'unit.weight': 'Gewicht',
        'unit.temperature': 'Temperatur',
        'unit.volume': 'Volumen',
        'unit.area': 'Fläche',
        'unit.data': 'Daten',
        'unit.speed': 'Geschwindigkeit',
        'unit.time': 'Zeit',

        // Graph
        'graph.addFunction': 'Funktion Hinzufügen',
        'graph.presets': 'Voreinstellungen',
        'graph.zoomIn': 'Vergrößern',
        'graph.zoomOut': 'Verkleinern',
        'graph.reset': 'Ansicht Zurücksetzen',

        // History
        'history.title': 'Verlauf',
        'history.clear': 'Verlauf Löschen',
        'history.empty': 'Noch keine Berechnungen',

        // Errors
        'error.divisionByZero': 'Division durch Null',
        'error.invalidExpression': 'Ungültiger Ausdruck',
        'error.overflow': 'Zahl zu groß'
    }
};

const LANGUAGE_KEY = 'angular-calculator-language';

@Injectable({
    providedIn: 'root'
})
export class I18nService {
    private readonly _language = signal<Language>(this.getInitialLanguage());
    readonly language = this._language.asReadonly();

    readonly languageOptions: { code: Language; name: string; flag: string }[] = [
        { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
    ];

    /**
     * Belirtilen anahtarın çevirisini döndür
     */
    t(key: string): string {
        const lang = this._language();
        return translations[lang][key] || translations['en'][key] || key;
    }

    /**
     * Dili değiştir
     */
    setLanguage(lang: Language): void {
        this._language.set(lang);
        this.saveLanguage(lang);
        document.documentElement.lang = lang;
    }

    /**
     * Başlangıç dilini belirle
     */
    private getInitialLanguage(): Language {
        // SessionStorage'dan oku
        try {
            const saved = sessionStorage.getItem(LANGUAGE_KEY) as Language;
            if (saved && translations[saved]) {
                return saved;
            }
        } catch {
            // Hata durumunda devam et
        }

        // Tarayıcı dilini kontrol et
        if (typeof navigator !== 'undefined') {
            const browserLang = navigator.language.split('-')[0] as Language;
            if (translations[browserLang]) {
                return browserLang;
            }
        }

        return 'tr'; // Varsayılan Türkçe
    }

    /**
     * Dili sessionStorage'a kaydet
     */
    private saveLanguage(lang: Language): void {
        try {
            sessionStorage.setItem(LANGUAGE_KEY, lang);
        } catch {
            // Kaydetme hatası
        }
    }
}
