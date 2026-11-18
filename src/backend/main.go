package main

import (
    "log"
    "net/http"
    "time"
    "user-calendar-api/src/handler"
    "user-calendar-api/src/repository"
    "user-calendar-api/src/service"
)

func main() {
    data, err := repository.NewJSONRepository(
        "../../data/participants.json",
        "../../data/daily.json",
    )
    if err != nil {
        log.Fatal("failed to load data: ", err)
    }

    calendarService := service.NewCalendarService(data)
    calendarHandler := handler.NewCalendarHandler(
        calendarService,
    )

    mux := http.NewServeMux()

	mux.HandleFunc(
		"GET /api/studies/alpha/participants",
		calendarHandler.GetAllParticipants,
	)

    mux.HandleFunc(
        "GET /api/studies/alpha/participants/{participantId}/calendar",
        calendarHandler.GetCalendar,
    )

    mux.HandleFunc("GET /health", func(
        w http.ResponseWriter,
        r *http.Request,
    ) {
        w.Header().Set("Content-Type", "application/json")
        w.Write([]byte(`{"status":"ok"}`))
    })

    server := &http.Server{
        Addr:              ":8080",
        Handler:           mux,
        ReadHeaderTimeout: 5 * time.Second,
    }

    log.Println("Go API running on http://localhost:8080")

    log.Fatal(server.ListenAndServe())
}
