# Study Activity Calendar

This is an assessment using **Go** for the backend and **React** for the frontend.

Some requirements weren't completely clear, so I made a few assumptions and built it this way.

## How it works

- **Data:** Load the provided seed files into memory when the backend starts. No database or Redis.
- **Backend:** Use Go's built-in HTTP server, without an external web framework.
- **Frontend:** Two pages, with no login or authentication.

### REST APIs

Two REST APIs are created

- `GET /api/studies/alpha/participants` — Get all participants.
- `GET /api/studies/alpha/participants/{participantId}/calendar` — Get a participant's activity calendar.

### Pages

1. **Participant selection:** Pick a participant from the dropdown and click to view their activity.
2. **Activity calendar:** See the participant ID, device name, and daily activity status (**met**, **unmet**, or **no data**). Use the arrows to switch months.

## Run locally

Start the backend first, then the frontend.

**1. Backend**

From the repository root:

```bash
cd src/backend
go run .
```

**2. Frontend**

Open another terminal and run from the repository root:

```bash
cd src/frontend
npm install
npm run dev
```

**3. Open the app**

Go to http://localhost:5173/ in your browser.
