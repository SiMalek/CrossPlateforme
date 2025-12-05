// Date utility functions for consistent date formatting across the app

/**
 * Format date as YYYY-MM-DD
 */
export const formatDateISO = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Format date in French format: "Lundi 20 Janvier 2025"
 */
export const formatDateFrenchLong = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(d.getTime())) {
        return 'Date invalide';
    }

    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    return d.toLocaleDateString('fr-FR', options);
};

/**
 * Format date in short French format: "20/01/2025"
 */
export const formatDateFrenchShort = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(d.getTime())) {
        return 'Date invalide';
    }

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
};

/**
 * Format date with time: "20 janv., 14:30"
 */
export const formatDateTimeShort = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(d.getTime())) {
        return 'Date invalide';
    }

    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    };

    return d.toLocaleDateString('fr-FR', options);
};

/**
 * Get current date as YYYY-MM-DD string
 */
export const getCurrentDateISO = (): string => {
    return formatDateISO(new Date());
};

/**
 * Get current local date and time as ISO string
 */
export const getLocalDateTimeISO = (): string => {
    return new Date().toISOString();
};

/**
 * Parse various date formats to Date object
 */
export const parseDate = (dateString: string): Date => {
    // Try ISO format first
    let date = new Date(dateString);

    // If invalid, try other formats
    if (isNaN(date.getTime())) {
        // Try DD/MM/YYYY format
        const parts = dateString.split('/');
        if (parts.length === 3) {
            date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        }
    }

    return date;
};
