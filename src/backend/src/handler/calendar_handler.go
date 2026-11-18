package handler

import (
    "encoding/json"
    "errors"
	"log"
    "net/http"
    "time"
	"user-calendar-api/src/models"
    "user-calendar-api/src/service"
)

type CalendarHandler struct {
    service *service.CalendarService
}

func (h *CalendarHandler) GetAllParticipants(
    w http.ResponseWriter,
    r *http.Request,
) {
    participants := h.service.GetAllParticipants()

    if participants == nil {
        participants = []models.Participant{}
    }

    w.Header().Set("Content-Type", "application/json")

    if err := json.NewEncoder(w).Encode(participants); err != nil {
        log.Printf("failed to encode participants: %v", err)
    }
}

func NewCalendarHandler(
    service *service.CalendarService,
) *CalendarHandler {
    return &CalendarHandler{service: service}
}

func (h *CalendarHandler) GetCalendar(
    w http.ResponseWriter,
    r *http.Request,
) {
    participantID := r.PathValue("participantId")
    month := r.URL.Query().Get("month")

    parsed, err := time.Parse("2006-01", month)
    if err != nil || parsed.Format("2006-01") != month {
        http.Error(
            w,
            "invalid month; expected YYYY-MM",
            http.StatusBadRequest,
        )
        return
    }

    result, err := h.service.GetCalendar(
        participantID,
        month,
    )

    if errors.Is(err, service.ErrParticipantNotFound) {
        http.Error(
            w,
            "participant not found",
            http.StatusNotFound,
        )
        return
    }

    if err != nil {
        http.Error(
            w,
            "internal server error",
            http.StatusInternalServerError,
        )
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(result)
}
