import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import { Mark } from '../models';
import { IonButton, IonIcon } from '@ionic/react';
import { chevronBack, chevronForward } from 'ionicons/icons';
import { motion, useMotionValue, animate } from 'framer-motion';
import './Calendar.scss';

type ViewMode = 'month' | 'year';

interface CalendarProps {
  markIds: Record<string, string>;
  comments: Record<string, string>;
  getMarkById: (markId: string) => Mark | undefined;
  onDateClick: (dateKey: string) => void;
  onViewDateChange?: (year: number, month: number, viewMode: ViewMode) => void;
}

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const getDateKey = (year: number, month: number, day: number): string => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

interface MiniMonthDays {
  days: Array<{ day: number; dateKey: string }>;
  startDayOfWeek: number;
}

const getMiniMonthDays = (year: number, month: number): MiniMonthDays => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const days: Array<{ day: number; dateKey: string }> = [];
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      day,
      dateKey: getDateKey(year, month, day),
    });
  }

  return { days, startDayOfWeek };
};

const getCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const days: Array<{ day: number; dateKey: string; isCurrentMonth: boolean }> = [];

  for (let i = 0; i < startDayOfWeek; i++) {
    const prevMonthDay = new Date(year, month, -startDayOfWeek + i + 1);
    days.push({
      day: prevMonthDay.getDate(),
      dateKey: getDateKey(prevMonthDay.getFullYear(), prevMonthDay.getMonth(), prevMonthDay.getDate()),
      isCurrentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      day,
      dateKey: getDateKey(year, month, day),
      isCurrentMonth: true,
    });
  }

  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const nextMonthDay = new Date(year, month + 1, i);
    days.push({
      day: nextMonthDay.getDate(),
      dateKey: getDateKey(nextMonthDay.getFullYear(), nextMonthDay.getMonth(), nextMonthDay.getDate()),
      isCurrentMonth: false,
    });
  }

  return days;
};

interface MonthGridProps {
  slideDate: { year: number; month: number };
  markIds: Record<string, string>;
  comments: Record<string, string>;
  getMarkById: (markId: string) => Mark | undefined;
  onDateClick: (dateKey: string) => void;
  todayKey: string;
}

const MonthGrid = React.memo<MonthGridProps>(({ slideDate, markIds, comments, getMarkById, onDateClick, todayKey }) => {
  const calendarDays = useMemo(() => getCalendarDays(slideDate.year, slideDate.month), [slideDate.year, slideDate.month]);

  return (
    <div className="calendar-grid">
      {calendarDays.map((dateInfo, index) => {
        const markId = markIds[dateInfo.dateKey];
        const mark = markId ? getMarkById(markId) : undefined;
        const hasComment = !!comments[dateInfo.dateKey];
        const isToday = dateInfo.dateKey === todayKey;
        const isWeekend = index % 7 === 0 || index % 7 === 6;

        return (
          <div
            key={index}
            className={`calendar-day ${dateInfo.isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''} ${mark ? 'has-mark' : ''} ${isWeekend ? 'weekend' : ''} ${hasComment ? 'has-comment' : ''}`}
            style={mark ? { backgroundColor: mark.backgroundColor } : hasComment ? { backgroundColor: 'var(--calendar-surface)' } : undefined}
            onClick={() => onDateClick(dateInfo.dateKey)}
          >
            <div className="day-header">
              <span className="day-number">{dateInfo.day}</span>
            </div>
            {hasComment && <div className="comment-fold" />}
            {mark && (
              <span className="day-mark">
                {mark.emojis.join('')}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
});

interface YearGridProps {
  slideDate: { year: number; month: number };
  markIds: Record<string, string>;
  getMarkById: (markId: string) => Mark | undefined;
  handleMonthClick: (year: number, month: number) => void;
  todayKey: string;
  today: Date;
}

const YearGrid = React.memo<YearGridProps>(({ slideDate, markIds, getMarkById, handleMonthClick, todayKey, today }) => {
  const yearMonths = useMemo(() => Array.from({ length: 12 }, (_, month) => getMiniMonthDays(slideDate.year, month)), [slideDate.year]);

  return (
    <div className="year-grid">
      {yearMonths.map((monthData, monthIndex) => {
        const isCurrentMonth = slideDate.year === today.getFullYear() && monthIndex === today.getMonth();

        return (
          <div
            key={monthIndex}
            className={`year-month ${isCurrentMonth ? 'year-month--current' : ''}`}
            onClick={() => handleMonthClick(slideDate.year, monthIndex)}
          >
            <div className={`year-month__name ${isCurrentMonth ? 'year-month__name--current' : ''}`}>
              {MONTHS_SHORT[monthIndex]}
            </div>
            <div className="year-month__grid">
              {DAYS.map((d, i) => (
                <div key={i} className="year-month__weekday">{d}</div>
              ))}
              {Array.from({ length: monthData.startDayOfWeek }, (_, i) => (
                <div key={`empty-${i}`} className="year-month__day year-month__day--empty" />
              ))}
              {monthData.days.map((dayInfo) => {
                const markId = markIds[dayInfo.dateKey];
                const mark = markId ? getMarkById(markId) : undefined;
                const isToday = dayInfo.dateKey === todayKey;

                return (
                  <div
                    key={dayInfo.day}
                    className={`year-month__day ${mark ? 'year-month__day--marked' : ''} ${isToday ? 'year-month__day--today' : ''}`}
                    style={mark ? { backgroundColor: mark.backgroundColor } : undefined}
                  >
                    <span className="year-month__day-num">{dayInfo.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
});

const Calendar: React.FC<CalendarProps> = ({ markIds, comments, getMarkById, onDateClick, onViewDateChange }) => {
  const today = useMemo(() => new Date(), []);
  const todayKey = getDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const [baseDate, setBaseDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [page, setPage] = useState(0);

  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  const getOffsetDate = useCallback((base: { year: number; month: number }, offset: number, mode: ViewMode) => {
    if (mode === 'month') {
      const totalMonths = base.year * 12 + base.month + offset;
      return {
        year: Math.floor(totalMonths / 12),
        month: ((totalMonths % 12) + 12) % 12,
      };
    } else {
      return {
        year: base.year + offset,
        month: base.month,
      };
    }
  }, []);

  const viewDate = useMemo(() => {
    return getOffsetDate(baseDate, page, viewMode);
  }, [baseDate, page, viewMode, getOffsetDate]);

  // Use useEffect to immediately invoke the callback when the viewDate or mode changes
  // We don't use flushSync here, React handles the state batching properly
  useEffect(() => {
    if (onViewDateChange) {
      onViewDateChange(viewDate.year, viewDate.month, viewMode);
    }
  }, [viewDate.year, viewDate.month, viewMode, onViewDateChange]);

  const prevDate = useMemo(() => getOffsetDate(viewDate, -1, viewMode), [viewDate, viewMode, getOffsetDate]);
  const nextDate = useMemo(() => getOffsetDate(viewDate, 1, viewMode), [viewDate, viewMode, getOffsetDate]);

  const slides = useMemo(() => [
    { key: `${prevDate.year}-${prevDate.month}`, date: prevDate },
    { key: `${viewDate.year}-${viewDate.month}`, date: viewDate },
    { key: `${nextDate.year}-${nextDate.month}`, date: nextDate }
  ], [prevDate, viewDate, nextDate]);

  const paginate = useCallback((newDirection: number) => {
    setPage((prev) => prev + newDirection);
  }, []);

  const handleNext = () => {
    // x.stop() aborts any ongoing animation immediately
    x.stop();
    const width = containerRef.current?.offsetWidth || 0;
    if (!width) { paginate(1); return; }

    isAnimating.current = true;
    const currentX = x.get();

    flushSync(() => paginate(1));
    x.set(currentX + width);

    animate(x, 0, {
      type: 'spring', bounce: 0, duration: 0.3,
      onComplete: () => { isAnimating.current = false; }
    });
  };

  const handlePrev = () => {
    x.stop();
    const width = containerRef.current?.offsetWidth || 0;
    if (!width) { paginate(-1); return; }

    isAnimating.current = true;
    const currentX = x.get();

    flushSync(() => paginate(-1));
    x.set(currentX - width);

    animate(x, 0, {
      type: 'spring', bounce: 0, duration: 0.3,
      onComplete: () => { isAnimating.current = false; }
    });
  };

  const goToToday = () => {
    x.stop();
    isAnimating.current = false;
    flushSync(() => {
      setBaseDate({
        year: today.getFullYear(),
        month: today.getMonth(),
      });
      setPage(0);
      setViewMode('month');
      x.set(0);
    });
  };

  const toggleViewMode = () => {
    x.stop();
    isAnimating.current = false;
    flushSync(() => {
      setBaseDate(viewDate);
      setPage(0);
      setViewMode((prev) => (prev === 'month' ? 'year' : 'month'));
      x.set(0);
    });
  };

  const handleMonthClick = useCallback((year: number, month: number) => {
    x.stop();
    isAnimating.current = false;
    flushSync(() => {
      setBaseDate({ year, month });
      setPage(0);
      setViewMode('month');
      x.set(0);
    });
  }, []);

  const onDragStart = () => {
    // If a user drags during an animation, stop it immediately to allow immediate control
    x.stop();
    isAnimating.current = true;
  };

  const onDragEnd = (e: any, { velocity }: any) => {
    const width = containerRef.current?.offsetWidth || 0;
    if (!width) {
      isAnimating.current = false;
      return;
    }

    const currentX = x.get();

    // Evaluate based on current visual position and velocity
    const projectedX = currentX + velocity.x * 0.2;

    if (projectedX < -width * 0.3) {
      flushSync(() => paginate(1));
      x.set(currentX + width);
      animate(x, 0, {
        type: 'spring', bounce: 0, duration: 0.3,
        onComplete: () => { isAnimating.current = false; }
      });
    } else if (projectedX > width * 0.3) {
      flushSync(() => paginate(-1));
      x.set(currentX - width);
      animate(x, 0, {
        type: 'spring', bounce: 0, duration: 0.3,
        onComplete: () => { isAnimating.current = false; }
      });
    } else {
      animate(x, 0, {
        type: 'spring', bounce: 0, duration: 0.3,
        onComplete: () => { isAnimating.current = false; }
      });
    }
  };

  const headerTitle = viewMode === 'month'
    ? `${MONTHS[viewDate.month]} ${viewDate.year}`
    : `${viewDate.year}`;

  return (
    <div className="calendar">
      <div className="calendar-header">
        <IonButton fill="clear" size="small" onClick={handlePrev}>
          <IonIcon icon={chevronBack} slot="icon-only" />
        </IonButton>
        <IonButton fill="clear" className="month-year" onClick={toggleViewMode}>
          {headerTitle}
        </IonButton>
        <IonButton fill="clear" size="small" onClick={handleNext}>
          <IonIcon icon={chevronForward} slot="icon-only" />
        </IonButton>
      </div>

      <IonButton fill="outline" size="small" className="today-btn" onClick={goToToday}>
        Today
      </IonButton>

      {viewMode === 'month' && (
        <div className="calendar-weekdays">
          {DAYS.map((day, i) => (
            <div key={i} className={`weekday${i === 0 || i === 6 ? ' weekend' : ''}`}>
              {day}
            </div>
          ))}
        </div>
      )}

      <div className="calendar-carousel" ref={containerRef}>
        <motion.div
          className="calendar-carousel-inner"
          style={{ x }}
          drag="x"
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          {slides.map((slide, index) => (
            <div key={slide.key} className={`calendar-carousel-slide ${index === 1 ? 'calendar-carousel-slide--active' : ''}`}>
              {viewMode === 'month' ? (
                <MonthGrid
                  slideDate={slide.date}
                  markIds={markIds}
                  comments={comments}
                  getMarkById={getMarkById}
                  onDateClick={onDateClick}
                  todayKey={todayKey}
                />
              ) : (
                <YearGrid
                  slideDate={slide.date}
                  markIds={markIds}
                  getMarkById={getMarkById}
                  handleMonthClick={handleMonthClick}
                  todayKey={todayKey}
                  today={today}
                />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Calendar;