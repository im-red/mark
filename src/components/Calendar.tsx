import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Mark } from '../models';
import { IonButton, IonIcon } from '@ionic/react';
import { chevronBack, chevronForward } from 'ionicons/icons';
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

const Calendar: React.FC<CalendarProps> = ({ markIds, comments, getMarkById, onDateClick, onViewDateChange }) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  const handleViewDateChange = useCallback((year: number, month: number, mode: ViewMode) => {
    onViewDateChange?.(year, month, mode);
  }, [onViewDateChange]);

  useEffect(() => {
    handleViewDateChange(viewDate.year, viewDate.month, viewMode);
  }, [viewDate, viewMode, handleViewDateChange]);

  const calendarDays = useMemo(() => {
    const { year, month } = viewDate;
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
  }, [viewDate]);

  const yearMonths = useMemo(() => {
    return Array.from({ length: 12 }, (_, month) => getMiniMonthDays(viewDate.year, month));
  }, [viewDate.year]);

  const goToPrev = () => {
    setViewDate((prev) => {
      if (viewMode === 'year') {
        return { ...prev, year: prev.year - 1 };
      }
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { ...prev, month: prev.month - 1 };
    });
  };

  const goToNext = () => {
    setViewDate((prev) => {
      if (viewMode === 'year') {
        return { ...prev, year: prev.year + 1 };
      }
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { ...prev, month: prev.month + 1 };
    });
  };

  const goToToday = () => {
    setViewDate({
      year: today.getFullYear(),
      month: today.getMonth(),
    });
    setViewMode('month');
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'month' ? 'year' : 'month'));
  };

  const handleMonthClick = (month: number) => {
    setViewDate((prev) => ({ ...prev, month }));
    setViewMode('month');
  };

  const todayKey = getDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const headerTitle = viewMode === 'month'
    ? `${MONTHS[viewDate.month]} ${viewDate.year}`
    : `${viewDate.year}`;

  return (
    <div className="calendar">
      <div className="calendar-header">
        <IonButton fill="clear" size="small" onClick={goToPrev}>
          <IonIcon icon={chevronBack} slot="icon-only" />
        </IonButton>
        <IonButton fill="clear" className="month-year" onClick={toggleViewMode}>
          {headerTitle}
        </IonButton>
        <IonButton fill="clear" size="small" onClick={goToNext}>
          <IonIcon icon={chevronForward} slot="icon-only" />
        </IonButton>
      </div>

      <IonButton fill="outline" size="small" className="today-btn" onClick={goToToday}>
        Today
      </IonButton>

      {viewMode === 'month' && (
        <>
          <div className="calendar-weekdays">
            {DAYS.map((day, i) => (
              <div key={i} className={`weekday${i === 0 || i === 6 ? ' weekend' : ''}`}>
                {day}
              </div>
            ))}
          </div>

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
                  style={mark ? { backgroundColor: mark.backgroundColor } : hasComment ? { backgroundColor: 'var(--surface)' } : undefined}
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
        </>
      )}

      {viewMode === 'year' && (
        <div className="year-grid">
          {yearMonths.map((monthData, monthIndex) => {
            const isCurrentMonth = viewDate.year === today.getFullYear() && monthIndex === today.getMonth();

            return (
              <div
                key={monthIndex}
                className={`year-month ${isCurrentMonth ? 'year-month--current' : ''}`}
                onClick={() => handleMonthClick(monthIndex)}
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
      )}
    </div>
  );
};

export default Calendar;
