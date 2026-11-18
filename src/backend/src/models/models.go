package models

type Participant struct {
    ParticipantID string `json:"participantId"`
    DeviceID      string `json:"deviceId"`
    Site          string `json:"site"`
    EnrolledOn    string `json:"enrolledOn"`
}

type DailyRecord struct {
    ParticipantID string  `json:"participantId"`
    Date          string  `json:"date"`
    WearHours     float64 `json:"wearHours"`
    SyncCount     int     `json:"syncCount"`
}

type CalendarResponse struct {
    ParticipantID string        `json:"participantId"`
    DeviceID      string        `json:"deviceId"`
    Site          string        `json:"site"`
    Month         string        `json:"month"`
    Days          []CalendarDay `json:"days"`
}

type CalendarDay struct {
    Date      string  `json:"date"`
    WearHours float64 `json:"wearHours"`
    SyncCount int     `json:"syncCount"`
}