import { CurrentPage } from '../../lib/types';
import { COLORS } from '../../lib/constants';

interface ProgressIndicatorProps {
  currentPage: CurrentPage;
}

export function ProgressIndicator({ currentPage }: ProgressIndicatorProps) {
  const steps: Array<{ page: CurrentPage; label: string }> = [
    { page: 'identity', label: '0' },
    { page: 'reservation', label: '1' },
    { page: 'amenagements', label: '2' },
    { page: 'complementaires', label: '3' },
    { page: 'visibilite', label: '4' },
    { page: 'engagement', label: '5' },
  ];

  const currentIndex = steps.findIndex((step) => step.page === currentPage);

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = currentIndex >= index;
          const isCurrent = currentIndex === index;
          const backgroundColor = isCompleted ? COLORS.secondary : '#ccc';

          return (
            <div key={step.page} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-semibold ${
                  isCurrent ? 'ring-2 ring-offset-2 ring-[#4ED545]' : ''
                }`}
                style={{ backgroundColor }}
              >
                {step.label}
              </div>
              {index < steps.length - 1 && (
                <div
                  className="h-1 w-16 mx-2 rounded"
                  style={{ backgroundColor: currentIndex > index ? COLORS.secondary : '#ccc' }}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}