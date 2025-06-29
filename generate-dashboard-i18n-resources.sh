#!/bin/bash

# Script to generate i18n language resource files for all centralized-dashboard services

SERVICES=(
    "centralized-analytics-dashboard"
    "centralized-core"
    "centralized-dashboard-production"
    "centralized-dashboard-shared"
    "centralized-dashboard-staging"
    "centralized-data-aggregation"
    "centralized-performance-metrics"
    "centralized-real-time-data"
    "centralized-reporting"
)

LANGUAGES=("en" "fr" "de" "es" "ar")

# Function to create messages.properties for each language
create_language_file() {
    local service=$1
    local service_path=$2
    local lang=$3
    local file_path="$service_path/i18n/$lang/messages.properties"
    
    # Create language-specific directory if it doesn't exist
    mkdir -p "$service_path/i18n/$lang"
    
    # Get clean service name for display
    local display_name=$(echo "$service" | tr '-' ' ' | sed 's/\b\(.\)/\u\1/g')
    
    case $lang in
        "en")
            cat > "$file_path" << EOF
# English language resources for ${service}
app.name=${display_name}
app.description=Centralized Dashboard Service - ${display_name}
app.version=1.0.0

# Common messages
message.welcome=Welcome to ${display_name}
message.success=Operation completed successfully
message.error=An error occurred
message.warning=Warning
message.info=Information
message.loading=Loading...
message.nodata=No data available
message.retry=Retry
message.cancel=Cancel
message.confirm=Confirm
message.save=Save
message.delete=Delete
message.edit=Edit
message.create=Create
message.update=Update
message.search=Search
message.filter=Filter
message.export=Export
message.import=Import
message.refresh=Refresh

# Dashboard specific messages
dashboard.title=Dashboard
dashboard.overview=Overview
dashboard.analytics=Analytics
dashboard.metrics=Metrics
dashboard.reports=Reports
dashboard.realtime=Real-time Data
dashboard.performance=Performance
dashboard.alerts=Alerts
dashboard.settings=Settings
dashboard.users=Users
dashboard.admin=Administration

# Status messages
status.starting=Service is starting...
status.running=Service is running
status.stopping=Service is stopping...
status.stopped=Service has stopped
status.healthy=Service is healthy
status.unhealthy=Service is unhealthy
status.active=Active
status.inactive=Inactive
status.online=Online
status.offline=Offline
status.connected=Connected
status.disconnected=Disconnected

# Error messages
error.general=An unexpected error occurred
error.validation=Validation failed
error.notfound=Resource not found
error.unauthorized=Unauthorized access
error.forbidden=Access forbidden
error.conflict=Resource conflict
error.server=Internal server error
error.database=Database connection error
error.network=Network error
error.timeout=Operation timed out
error.connection=Connection failed
error.authentication=Authentication failed
error.permission=Insufficient permissions

# Validation messages
validation.required=This field is required
validation.invalid=Invalid value
validation.min.length=Minimum length is {0}
validation.max.length=Maximum length is {0}
validation.email=Invalid email format
validation.password=Password must be at least 8 characters
validation.numeric=Must be a number
validation.positive=Must be a positive number
validation.date=Invalid date format
validation.url=Invalid URL format

# API messages
api.request.received=Request received
api.response.sent=Response sent
api.authentication.required=Authentication required
api.authorization.failed=Authorization failed
api.rate.limit=Rate limit exceeded
api.maintenance=Service under maintenance

# Data aggregation messages
data.aggregation.started=Data aggregation started
data.aggregation.completed=Data aggregation completed
data.aggregation.failed=Data aggregation failed
data.sync.started=Data synchronization started
data.sync.completed=Data synchronization completed
data.processing=Processing data...

# Analytics messages
analytics.generating=Generating analytics...
analytics.completed=Analytics generation completed
analytics.nodata=No analytics data available
analytics.export.started=Analytics export started
analytics.export.completed=Analytics export completed

# Real-time messages
realtime.connected=Real-time connection established
realtime.disconnected=Real-time connection lost
realtime.reconnecting=Reconnecting...
realtime.data.received=Real-time data received
realtime.streaming=Streaming data...

# Performance messages
performance.monitoring=Performance monitoring active
performance.alert=Performance alert triggered
performance.optimal=Performance optimal
performance.degraded=Performance degraded
performance.critical=Performance critical

# Reporting messages
report.generating=Generating report...
report.completed=Report generated successfully
report.failed=Report generation failed
report.scheduled=Report scheduled
report.delivered=Report delivered
report.export.pdf=Export as PDF
report.export.excel=Export as Excel
report.export.csv=Export as CSV

# Date and time
date.today=Today
date.yesterday=Yesterday
date.thisweek=This Week
date.thismonth=This Month
date.thisyear=This Year
time.now=Now
time.minutes.ago={0} minutes ago
time.hours.ago={0} hours ago
time.days.ago={0} days ago

# Numbers and units
unit.bytes=Bytes
unit.kb=KB
unit.mb=MB
unit.gb=GB
unit.tb=TB
unit.requests=Requests
unit.users=Users
unit.percentage=Percentage
unit.count=Count
unit.rate=Rate
unit.latency=Latency
unit.throughput=Throughput
EOF
            ;;
        "fr")
            cat > "$file_path" << EOF
# French language resources for ${service}
app.name=${display_name}
app.description=Service de Tableau de Bord Centralisé - ${display_name}
app.version=1.0.0

# Messages communs
message.welcome=Bienvenue dans ${display_name}
message.success=Opération terminée avec succès
message.error=Une erreur s'est produite
message.warning=Avertissement
message.info=Information
message.loading=Chargement...
message.nodata=Aucune donnée disponible
message.retry=Réessayer
message.cancel=Annuler
message.confirm=Confirmer
message.save=Enregistrer
message.delete=Supprimer
message.edit=Modifier
message.create=Créer
message.update=Mettre à jour
message.search=Rechercher
message.filter=Filtrer
message.export=Exporter
message.import=Importer
message.refresh=Actualiser

# Messages spécifiques au tableau de bord
dashboard.title=Tableau de Bord
dashboard.overview=Vue d'ensemble
dashboard.analytics=Analytique
dashboard.metrics=Métriques
dashboard.reports=Rapports
dashboard.realtime=Données en Temps Réel
dashboard.performance=Performance
dashboard.alerts=Alertes
dashboard.settings=Paramètres
dashboard.users=Utilisateurs
dashboard.admin=Administration

# Messages de statut
status.starting=Le service démarre...
status.running=Le service est en cours d'exécution
status.stopping=Le service s'arrête...
status.stopped=Le service s'est arrêté
status.healthy=Le service est sain
status.unhealthy=Le service est défaillant
status.active=Actif
status.inactive=Inactif
status.online=En ligne
status.offline=Hors ligne
status.connected=Connecté
status.disconnected=Déconnecté

# Messages d'erreur
error.general=Une erreur inattendue s'est produite
error.validation=La validation a échoué
error.notfound=Ressource introuvable
error.unauthorized=Accès non autorisé
error.forbidden=Accès interdit
error.conflict=Conflit de ressources
error.server=Erreur interne du serveur
error.database=Erreur de connexion à la base de données
error.network=Erreur réseau
error.timeout=Délai d'attente dépassé
error.connection=Échec de la connexion
error.authentication=Échec de l'authentification
error.permission=Permissions insuffisantes

# Messages de validation
validation.required=Ce champ est obligatoire
validation.invalid=Valeur invalide
validation.min.length=La longueur minimale est {0}
validation.max.length=La longueur maximale est {0}
validation.email=Format d'email invalide
validation.password=Le mot de passe doit contenir au moins 8 caractères
validation.numeric=Doit être un nombre
validation.positive=Doit être un nombre positif
validation.date=Format de date invalide
validation.url=Format d'URL invalide

# Messages d'agrégation de données
data.aggregation.started=Agrégation de données démarrée
data.aggregation.completed=Agrégation de données terminée
data.aggregation.failed=Échec de l'agrégation de données
data.sync.started=Synchronisation des données démarrée
data.sync.completed=Synchronisation des données terminée
data.processing=Traitement des données...

# Messages d'analytique
analytics.generating=Génération d'analytiques...
analytics.completed=Génération d'analytiques terminée
analytics.nodata=Aucune donnée analytique disponible
analytics.export.started=Export d'analytiques démarré
analytics.export.completed=Export d'analytiques terminé

# Messages temps réel
realtime.connected=Connexion temps réel établie
realtime.disconnected=Connexion temps réel perdue
realtime.reconnecting=Reconnexion...
realtime.data.received=Données temps réel reçues
realtime.streaming=Diffusion de données...

# Messages de performance
performance.monitoring=Surveillance de performance active
performance.alert=Alerte de performance déclenchée
performance.optimal=Performance optimale
performance.degraded=Performance dégradée
performance.critical=Performance critique

# Date et heure
date.today=Aujourd'hui
date.yesterday=Hier
date.thisweek=Cette Semaine
date.thismonth=Ce Mois
date.thisyear=Cette Année
time.now=Maintenant
time.minutes.ago=Il y a {0} minutes
time.hours.ago=Il y a {0} heures
time.days.ago=Il y a {0} jours
EOF
            ;;
        "de")
            cat > "$file_path" << EOF
# German language resources for ${service}
app.name=${display_name}
app.description=Zentralisierter Dashboard-Service - ${display_name}
app.version=1.0.0

# Allgemeine Nachrichten
message.welcome=Willkommen bei ${display_name}
message.success=Vorgang erfolgreich abgeschlossen
message.error=Ein Fehler ist aufgetreten
message.warning=Warnung
message.info=Information
message.loading=Laden...
message.nodata=Keine Daten verfügbar
message.retry=Wiederholen
message.cancel=Abbrechen
message.confirm=Bestätigen
message.save=Speichern
message.delete=Löschen
message.edit=Bearbeiten
message.create=Erstellen
message.update=Aktualisieren
message.search=Suchen
message.filter=Filtern
message.export=Exportieren
message.import=Importieren
message.refresh=Aktualisieren

# Dashboard-spezifische Nachrichten
dashboard.title=Dashboard
dashboard.overview=Übersicht
dashboard.analytics=Analytik
dashboard.metrics=Metriken
dashboard.reports=Berichte
dashboard.realtime=Echtzeit-Daten
dashboard.performance=Leistung
dashboard.alerts=Warnungen
dashboard.settings=Einstellungen
dashboard.users=Benutzer
dashboard.admin=Verwaltung

# Statusnachrichten
status.starting=Dienst wird gestartet...
status.running=Dienst läuft
status.stopping=Dienst wird beendet...
status.stopped=Dienst wurde beendet
status.healthy=Dienst ist gesund
status.unhealthy=Dienst ist fehlerhaft
status.active=Aktiv
status.inactive=Inaktiv
status.online=Online
status.offline=Offline
status.connected=Verbunden
status.disconnected=Getrennt

# Fehlermeldungen
error.general=Ein unerwarteter Fehler ist aufgetreten
error.validation=Validierung fehlgeschlagen
error.notfound=Ressource nicht gefunden
error.unauthorized=Nicht autorisierter Zugriff
error.forbidden=Zugriff verboten
error.conflict=Ressourcenkonflikt
error.server=Interner Serverfehler
error.database=Datenbankverbindungsfehler
error.network=Netzwerkfehler
error.timeout=Zeitüberschreitung
error.connection=Verbindung fehlgeschlagen
error.authentication=Authentifizierung fehlgeschlagen
error.permission=Unzureichende Berechtigungen

# Validierungsnachrichten
validation.required=Dieses Feld ist erforderlich
validation.invalid=Ungültiger Wert
validation.min.length=Mindestlänge ist {0}
validation.max.length=Maximale Länge ist {0}
validation.email=Ungültiges E-Mail-Format
validation.password=Passwort muss mindestens 8 Zeichen haben
validation.numeric=Muss eine Zahl sein
validation.positive=Muss eine positive Zahl sein
validation.date=Ungültiges Datumsformat
validation.url=Ungültiges URL-Format

# Datenaggregationsnachrichten
data.aggregation.started=Datenaggregation gestartet
data.aggregation.completed=Datenaggregation abgeschlossen
data.aggregation.failed=Datenaggregation fehlgeschlagen
data.sync.started=Datensynchronisation gestartet
data.sync.completed=Datensynchronisation abgeschlossen
data.processing=Daten werden verarbeitet...

# Datum und Zeit
date.today=Heute
date.yesterday=Gestern
date.thisweek=Diese Woche
date.thismonth=Dieser Monat
date.thisyear=Dieses Jahr
time.now=Jetzt
time.minutes.ago=Vor {0} Minuten
time.hours.ago=Vor {0} Stunden
time.days.ago=Vor {0} Tagen
EOF
            ;;
        "es")
            cat > "$file_path" << EOF
# Spanish language resources for ${service}
app.name=${display_name}
app.description=Servicio de Panel de Control Centralizado - ${display_name}
app.version=1.0.0

# Mensajes comunes
message.welcome=Bienvenido a ${display_name}
message.success=Operación completada con éxito
message.error=Se produjo un error
message.warning=Advertencia
message.info=Información
message.loading=Cargando...
message.nodata=No hay datos disponibles
message.retry=Reintentar
message.cancel=Cancelar
message.confirm=Confirmar
message.save=Guardar
message.delete=Eliminar
message.edit=Editar
message.create=Crear
message.update=Actualizar
message.search=Buscar
message.filter=Filtrar
message.export=Exportar
message.import=Importar
message.refresh=Actualizar

# Mensajes específicos del panel de control
dashboard.title=Panel de Control
dashboard.overview=Resumen
dashboard.analytics=Analítica
dashboard.metrics=Métricas
dashboard.reports=Informes
dashboard.realtime=Datos en Tiempo Real
dashboard.performance=Rendimiento
dashboard.alerts=Alertas
dashboard.settings=Configuración
dashboard.users=Usuarios
dashboard.admin=Administración

# Mensajes de estado
status.starting=El servicio está iniciando...
status.running=El servicio está en ejecución
status.stopping=El servicio se está deteniendo...
status.stopped=El servicio se ha detenido
status.healthy=El servicio está saludable
status.unhealthy=El servicio no está saludable
status.active=Activo
status.inactive=Inactivo
status.online=En línea
status.offline=Desconectado
status.connected=Conectado
status.disconnected=Desconectado

# Mensajes de error
error.general=Se produjo un error inesperado
error.validation=La validación falló
error.notfound=Recurso no encontrado
error.unauthorized=Acceso no autorizado
error.forbidden=Acceso prohibido
error.conflict=Conflicto de recursos
error.server=Error interno del servidor
error.database=Error de conexión a la base de datos
error.network=Error de red
error.timeout=Tiempo de espera agotado
error.connection=Conexión fallida
error.authentication=Autenticación fallida
error.permission=Permisos insuficientes

# Fecha y hora
date.today=Hoy
date.yesterday=Ayer
date.thisweek=Esta Semana
date.thismonth=Este Mes
date.thisyear=Este Año
time.now=Ahora
time.minutes.ago=Hace {0} minutos
time.hours.ago=Hace {0} horas
time.days.ago=Hace {0} días
EOF
            ;;
        "ar")
            cat > "$file_path" << EOF
# Arabic language resources for ${service}
app.name=${display_name}
app.description=خدمة لوحة التحكم المركزية - ${display_name}
app.version=1.0.0

# الرسائل الشائعة
message.welcome=مرحباً بك في ${display_name}
message.success=تمت العملية بنجاح
message.error=حدث خطأ
message.warning=تحذير
message.info=معلومات
message.loading=جاري التحميل...
message.nodata=لا توجد بيانات متاحة
message.retry=إعادة المحاولة
message.cancel=إلغاء
message.confirm=تأكيد
message.save=حفظ
message.delete=حذف
message.edit=تعديل
message.create=إنشاء
message.update=تحديث
message.search=بحث
message.filter=تصفية
message.export=تصدير
message.import=استيراد
message.refresh=تحديث

# رسائل لوحة التحكم
dashboard.title=لوحة التحكم
dashboard.overview=نظرة عامة
dashboard.analytics=التحليلات
dashboard.metrics=المقاييس
dashboard.reports=التقارير
dashboard.realtime=البيانات المباشرة
dashboard.performance=الأداء
dashboard.alerts=التنبيهات
dashboard.settings=الإعدادات
dashboard.users=المستخدمون
dashboard.admin=الإدارة

# رسائل الحالة
status.starting=الخدمة قيد البدء...
status.running=الخدمة قيد التشغيل
status.stopping=الخدمة قيد الإيقاف...
status.stopped=تم إيقاف الخدمة
status.healthy=الخدمة سليمة
status.unhealthy=الخدمة غير سليمة
status.active=نشط
status.inactive=غير نشط
status.online=متصل
status.offline=غير متصل
status.connected=متصل
status.disconnected=منقطع

# رسائل الخطأ
error.general=حدث خطأ غير متوقع
error.validation=فشل التحقق
error.notfound=المورد غير موجود
error.unauthorized=وصول غير مصرح به
error.forbidden=الوصول محظور
error.conflict=تعارض في الموارد
error.server=خطأ داخلي في الخادم
error.database=خطأ في اتصال قاعدة البيانات
error.network=خطأ في الشبكة
error.timeout=انتهت مهلة العملية
error.connection=فشل الاتصال
error.authentication=فشل المصادقة
error.permission=صلاحيات غير كافية

# التاريخ والوقت
date.today=اليوم
date.yesterday=أمس
date.thisweek=هذا الأسبوع
date.thismonth=هذا الشهر
date.thisyear=هذا العام
time.now=الآن
time.minutes.ago=منذ {0} دقائق
time.hours.ago=منذ {0} ساعات
time.days.ago=منذ {0} أيام
EOF
            ;;
    esac
}

# Function to create React-specific i18n files
create_react_i18n_files() {
    local service=$1
    local service_path=$2
    local lang=$3
    
    # Create React i18n structure
    mkdir -p "$service_path/src/i18n/locales/$lang"
    
    # Create index.js for language
    cat > "$service_path/src/i18n/locales/$lang/index.js" << EOF
// ${lang} translations for ${service}
export default {
  common: {
    welcome: 'Welcome to the Dashboard',
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Operation successful',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    refresh: 'Refresh'
  },
  
  navigation: {
    dashboard: 'Dashboard',
    analytics: 'Analytics',
    reports: 'Reports',
    settings: 'Settings',
    users: 'Users',
    admin: 'Administration'
  },
  
  dashboard: {
    title: 'Dashboard Overview',
    metrics: 'Key Metrics',
    realtime: 'Real-time Data',
    performance: 'Performance',
    alerts: 'Alerts'
  },
  
  analytics: {
    title: 'Analytics',
    generating: 'Generating analytics...',
    noData: 'No analytics data available',
    export: 'Export Analytics'
  },
  
  validation: {
    required: 'This field is required',
    email: 'Invalid email format',
    minLength: 'Minimum length is {count}',
    maxLength: 'Maximum length is {count}'
  },
  
  errors: {
    general: 'An unexpected error occurred',
    network: 'Network error',
    unauthorized: 'Unauthorized access',
    notFound: 'Resource not found'
  }
};
EOF

    # Create i18n configuration if this is the main service
    if [ "$service" == "centralized-analytics-dashboard" ]; then
        cat > "$service_path/src/i18n/index.js" << EOF
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import en from './locales/en';
import fr from './locales/fr';
import de from './locales/de';
import es from './locales/es';
import ar from './locales/ar';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  de: { translation: de },
  es: { translation: es },
  ar: { translation: ar }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false // React already escapes values
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;
EOF
    fi
}

# Function to create i18n configuration file
create_i18n_config() {
    local service=$1
    local service_path=$2
    
    cat > "$service_path/i18n/i18n-config.json" << EOF
{
  "service": "${service}",
  "defaultLanguage": "en",
  "supportedLanguages": ["en", "fr", "de", "es", "ar"],
  "fallbackLanguage": "en",
  "encoding": "UTF-8",
  "dateFormat": {
    "en": "MM/dd/yyyy HH:mm:ss",
    "fr": "dd/MM/yyyy HH:mm:ss",
    "de": "dd.MM.yyyy HH:mm:ss",
    "es": "dd/MM/yyyy HH:mm:ss",
    "ar": "yyyy/MM/dd HH:mm:ss"
  },
  "numberFormat": {
    "en": {"decimal": ".", "thousands": ","},
    "fr": {"decimal": ",", "thousands": " "},
    "de": {"decimal": ",", "thousands": "."},
    "es": {"decimal": ",", "thousands": "."},
    "ar": {"decimal": "٫", "thousands": "٬"}
  },
  "currency": {
    "en": "USD",
    "fr": "EUR",
    "de": "EUR",
    "es": "EUR",
    "ar": "USD"
  },
  "rtl": {
    "ar": true
  },
  "timezone": {
    "en": "America/New_York",
    "fr": "Europe/Paris",
    "de": "Europe/Berlin",
    "es": "Europe/Madrid",
    "ar": "Asia/Dubai"
  }
}
EOF
}

# Main execution
echo "Generating i18n language resources for all centralized-dashboard services..."

for service in "${SERVICES[@]}"; do
    echo "Processing ${service}..."
    service_path="/mnt/c/Users/frich/Desktop/Exalt-Application-Limited/Exalt-Application-Limited/social-ecommerce-ecosystem/centralized-dashboard/${service}"
    
    if [ -d "${service_path}/i18n" ] || [ -d "${service_path}" ]; then
        # Ensure i18n directory exists
        mkdir -p "$service_path/i18n"
        
        # Create language files
        for lang in "${LANGUAGES[@]}"; do
            create_language_file "${service}" "${service_path}" "${lang}"
            echo "  ✅ Created ${lang} resources"
        done
        
        # Create React-specific i18n files for React services
        if [ "$service" == "centralized-analytics-dashboard" ]; then
            for lang in "${LANGUAGES[@]}"; do
                create_react_i18n_files "${service}" "${service_path}" "${lang}"
            done
            echo "  ✅ Created React i18n structure"
        fi
        
        # Create i18n configuration
        create_i18n_config "${service}" "${service_path}"
        echo "  ✅ Created i18n configuration"
        
        echo "✅ Generated i18n resources for ${service}"
    else
        echo "❌ Service directory not found for ${service}"
    fi
done

echo "i18n resource generation complete!"