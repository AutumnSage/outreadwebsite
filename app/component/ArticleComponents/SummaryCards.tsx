import React, { useState } from 'react'

interface SummaryCardsProps {
    simpleSummary: [{
        heading: string,
        content: string,
    }]
    defaultSummary: [{
        heading: string,
        content: string,
    }]
    currentType: 'simple' | 'default'
    doi: string
    altmetricScore: number
}

export default function SummaryCards({
    simpleSummary,
    defaultSummary,
    currentType,
    doi,
    altmetricScore,
}: SummaryCardsProps) {
    const [currentCard, setCurrentCard] = useState(1)
    const summary = currentType === 'simple' ? simpleSummary : defaultSummary
    console.log({ summary })
    const cards = summary

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowUp' && currentCard > 0) {
            setCurrentCard(currentCard - 1)
        } else if (e.key === 'ArrowDown' && currentCard < cards.length - 1) {
            setCurrentCard(currentCard + 1)
        } else if (e.key === 'ArrowRight' && currentCard < cards.length - 1) {
            setCurrentCard(currentCard + 1)
        } else if (e.key === 'ArrowLeft' && currentCard > 0) {
            setCurrentCard(currentCard - 1)
        }
    }

    return (
        <div
            className="bg-white shadow-lg rounded-lg p-6 text-black"
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            <div className="mb-4">
                <p className="text-lg font-semibold">{`Card ${currentCard} of ${cards.length - 1}`}</p>
            </div>
            <div className="h-64 overflow-y-auto mb-4">
                <div className='font-semibold text-2xl'>
                    {cards[currentCard].heading}
                </div>
                {cards[currentCard].content.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                ))}

            </div>
            {currentCard === cards.length - 1 && (
                <div className="mt-4">
                    <p><strong>DOI:</strong> {doi}</p>
                    <p><strong>Altmetric Score:</strong> {altmetricScore}</p>
                </div>
            )}
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => setCurrentCard(Math.max(0, currentCard - 1))}
                    disabled={currentCard === 0}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
                >
                    Previous
                </button>
                <button
                    onClick={() => setCurrentCard(Math.min(cards.length - 1, currentCard + 1))}
                    disabled={currentCard === cards.length - 1}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
                >
                    Next
                </button>
            </div>
        </div>
    )
}