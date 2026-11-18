package service

import (
    "errors"
    "sort"
    "strings"
    "user-calendar-api/src/models"
    "user-calendar-api/src/repository"
)

var ErrParticipantNotFound = errors.New(
    "participant not found",
)

type CalendarService struct {
    data *repository.JSONRepository
}

func (s *CalendarService) GetAllParticipants() []models.Participant {
    return s.data.Participants
}

func NewCalendarService(
    data *repository.JSONRepository,
) *CalendarService {
    return &CalendarService{data: data}
}

func (s *CalendarService) GetCalendar(
    participantID string,
    month string,
) (*models.CalendarResponse, error) {

    var participant *models.Participant

    for i := range s.data.Participants {
        if s.data.Participants[i].ParticipantID == participantID {
            participant = &s.data.Participants[i]
            break
        }
    }

    if participant == nil {
        return nil, ErrParticipantNotFound
    }

    response := &models.CalendarResponse{
        ParticipantID: participant.ParticipantID,
        DeviceID:      participant.DeviceID,
        Site:          participant.Site,
        Month:         month,
        Days:          []models.CalendarDay{},
    }

    for _, record := range s.data.DailyRecords {
        if record.ParticipantID != participantID {
            continue
        }

        if !strings.HasPrefix(record.Date, month+"-") {
            continue
        }

        response.Days = append(
            response.Days,
            models.CalendarDay{
                Date:      record.Date,
                WearHours: record.WearHours,
                SyncCount: record.SyncCount,
            },
        )
    }

    sort.Slice(response.Days, func(i, j int) bool {
        return response.Days[i].Date < response.Days[j].Date
    })

    return response, nil
}