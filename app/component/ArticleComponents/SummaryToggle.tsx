import React from 'react'

interface SummaryToggleProps {
    summaryType: 'simple' | 'default'
    onToggle: (type: 'simple' | 'default') => void
}

export default function SummaryToggle({ summaryType, onToggle }: SummaryToggleProps) {
    return (
        <div className="flex items-center justify-center mb-4">
            <span className="mr-2">Simple</span>
            <label className="switch">
                <input
                    type="checkbox"
                    checked={summaryType === 'default'}
                    onChange={() => onToggle(summaryType === 'simple' ? 'default' : 'simple')}
                />
                <span className="slider round"></span>
            </label>
            <span className="ml-2">Default</span>
        </div>
    )
}