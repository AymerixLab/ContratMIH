import { CurrentPage } from '../../lib/types';
import { COLORS } from '../../lib/constants';

interface ProgressIndicatorProps {
  currentPage: CurrentPage;
}

export function ProgressIndicator({ currentPage }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-semibold ${
          currentPage === 'identity' ? 'ring-2 ring-offset-2 ring-[#4ED545]' : ''
        }`} style={{ backgroundColor: COLORS.secondary }}>
          0
        </div>
        <div className="h-1 w-16 rounded" style={{ backgroundColor: currentPage !== 'identity' ? COLORS.secondary : '#ccc' }}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-semibold ${
          currentPage === 'reservation' ? 'ring-2 ring-offset-2 ring-[#4ED545]' : ''
        }`} style={{ backgroundColor: currentPage !== 'identity' ? COLORS.secondary : '#ccc' }}>
          1
        </div>
        <div className="h-1 w-16 rounded" style={{ backgroundColor: (currentPage === 'amenagements' || currentPage === 'visibilite' || currentPage === 'engagement') ? COLORS.secondary : '#ccc' }}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-semibold ${
          currentPage === 'amenagements' ? 'ring-2 ring-offset-2 ring-[#4ED545]' : ''
        }`} style={{ backgroundColor: (currentPage === 'amenagements' || currentPage === 'visibilite' || currentPage === 'engagement') ? COLORS.secondary : '#ccc' }}>
          2
        </div>
        <div className="h-1 w-16 rounded" style={{ backgroundColor: (currentPage === 'visibilite' || currentPage === 'engagement') ? COLORS.secondary : '#ccc' }}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-semibold ${
          currentPage === 'visibilite' ? 'ring-2 ring-offset-2 ring-[#4ED545]' : ''
        }`} style={{ backgroundColor: (currentPage === 'visibilite' || currentPage === 'engagement') ? COLORS.secondary : '#ccc' }}>
          3
        </div>
        <div className="h-1 w-16 rounded" style={{ backgroundColor: currentPage === 'engagement' ? COLORS.secondary : '#ccc' }}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-semibold ${
          currentPage === 'engagement' ? 'ring-2 ring-offset-2 ring-[#4ED545]' : ''
        }`} style={{ backgroundColor: currentPage === 'engagement' ? COLORS.secondary : '#ccc' }}>
          4
        </div>
      </div>
    </div>
  );
}