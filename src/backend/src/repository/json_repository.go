package repository

import (
    "encoding/json"
    "os"
    "user-calendar-api/src/models"
)

type JSONRepository struct {
    Participants []models.Participant
    DailyRecords []models.DailyRecord
}

func NewJSONRepository(
    participantsPath string,
    dailyPath string,
) (*JSONRepository, error) {

    data := &JSONRepository{}

    participantData, err := os.ReadFile(participantsPath)
    if err != nil {
        return nil, err
    }

    if err := json.Unmarshal(
        participantData,
        &data.Participants,
    ); err != nil {
        return nil, err
    }

    dailyData, err := os.ReadFile(dailyPath)
    if err != nil {
        return nil, err
    }

    if err := json.Unmarshal(
        dailyData,
        &data.DailyRecords,
    ); err != nil {
        return nil, err
    }

    return data, nil
}