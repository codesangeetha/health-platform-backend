# Doctor Dashboard Calendar API

## Overview

The Doctor Dashboard Calendar API provides date-wise booking information for doctors for a given month. It returns organized calendar data including daily bookings, status counts, and monthly statistics.

## Endpoint

```
GET /api/v1/appointments/calendar
```

## Authentication

The API requires a valid doctor JWT token in the Authorization header:

```
Authorization: Bearer <doctor_token>
```

## Request Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| year | number | Yes | Year (2020-2030) | 2024 |
| month | number | Yes | Month (1-12) | 12 |

### Query String Example

```
GET /api/v1/appointments/calendar?year=2024&month=12
```

## Response Format

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Calendar data retrieved successfully",
  "timestamp": "2024-12-20T12:00:00.000Z",
  "data": {
    "year": 2024,
    "month": 12,
    "calendar": {
      "monthName": "December",
      "daysInMonth": 31,
      "firstDayOfWeek": 0,
      "bookingsByDate": [
        {
          "date": "2024-12-15",
          "day": 15,
          "dayName": "Sunday",
          "bookings": [
            {
              "appointmentId": "507f1f77bcf86cd799439011",
              "patient": {
                "patientId": "507f1f77bcf86cd799439012",
                "firstName": "John",
                "lastName": "Doe",
                "age": 35
              },
              "time": "10:00",
              "status": "confirmed",
              "appointmentType": "video",
              "reason": "Annual checkup"
            }
          ],
          "totalBookings": 1,
          "confirmedBookings": 1,
          "pendingBookings": 0,
          "completedBookings": 0
        }
      ]
    },
    "monthlyStats": {
      "totalBookings": 25,
      "confirmedBookings": 20,
      "pendingBookings": 3,
      "completedBookings": 2,
      "cancelledBookings": 0
    }
  }
}
```

### Error Response (400 Bad Request)

```json
{
  "success": false,
  "message": "Year and month are required query parameters",
  "error": "BAD_REQUEST",
  "timestamp": "2024-12-20T12:00:00.000Z"
}
```

### Error Response (401 Unauthorized)

```json
{
  "success": false,
  "message": "Doctor ID not found in token",
  "error": "UNAUTHORIZED",
  "timestamp": "2024-12-20T12:00:00.000Z"
}
```

### Error Response (500 Internal Server Error)

```json
{
  "success": false,
  "message": "Internal server error",
  "error": "INTERNAL_SERVER_ERROR",
  "timestamp": "2024-12-20T12:00:00.000Z"
}
```

## Response Details

### Calendar Object

| Field | Type | Description |
|-------|------|-------------|
| monthName | string | Full name of the month (e.g., "December") |
| daysInMonth | number | Number of days in the month |
| firstDayOfWeek | number | Day of week for the 1st of the month (0=Sunday, 1=Monday, etc.) |
| bookingsByDate | array | Array of day booking objects |

### Day Booking Object

| Field | Type | Description |
|-------|------|-------------|
| date | string | Date in YYYY-MM-DD format |
| day | number | Day of the month |
| dayName | string | Full name of the day (e.g., "Sunday") |
| bookings | array | Array of appointment bookings for this day |
| totalBookings | number | Total appointments for this day |
| confirmedBookings | number | Confirmed appointments for this day |
| pendingBookings | number | Pending appointments for this day |
| completedBookings | number | Completed appointments for this day |

### Booking Object

| Field | Type | Description |
|-------|------|-------------|
| appointmentId | string | Unique appointment identifier |
| patient | object | Patient information |
| patient.patientId | string | Patient ID |
| patient.firstName | string | Patient's first name |
| patient.lastName | string | Patient's last name |
| patient.age | number | Patient's age |
| time | string | Appointment time (HH:MM format) |
| status | string | Appointment status: "pending", "confirmed", "cancelled", "completed" |
| appointmentType | string | Type: "in-person" or "video" |
| reason | string | Reason for appointment (optional) |

### Monthly Stats Object

| Field | Type | Description |
|-------|------|-------------|
| totalBookings | number | Total appointments in the month |
| confirmedBookings | number | Confirmed appointments in the month |
| pendingBookings | number | Pending appointments in the month |
| completedBookings | number | Completed appointments in the month |
| cancelledBookings | number | Cancelled appointments in the month |

## Validation Rules

- **Year**: Must be between 2020 and 2030
- **Month**: Must be between 1 and 12
- Both parameters are required
- Doctor token must be valid and contain doctor ID

## Usage Examples

### Get December 2024 Calendar

```bash
curl -X GET "http://localhost:3000/api/v1/appointments/calendar?year=2024&month=12" \
  -H "Authorization: Bearer YOUR_DOCTOR_TOKEN" \
  -H "Content-Type: application/json"
```

### Get Current Month Calendar

```javascript
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1;

fetch(`/api/v1/appointments/calendar?year=${year}&month=${month}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${doctorToken}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log('Calendar data:', data);
  // Render calendar UI with the data
});
```

## Integration with Frontend

### Calendar Component Structure

```javascript
// Sample React component structure
const DoctorCalendar = ({ year, month, token }) => {
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendarData(year, month, token);
  }, [year, month, token]);

  const fetchCalendarData = async (year, month, token) => {
    try {
      const response = await fetch(`/api/v1/appointments/calendar?year=${year}&month=${month}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      setCalendarData(data.data);
    } catch (error) {
      console.error('Error fetching calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading calendar...</div>;
  if (!calendarData) return <div>No calendar data available</div>;

  return (
    <div className="doctor-calendar">
      <h2>{calendarData.calendar.monthName} {calendarData.year}</h2>
      <div className="calendar-grid">
        {calendarData.calendar.bookingsByDate.map(day => (
          <div key={day.date} className="calendar-day">
            <div className="day-header">
              <span>{day.dayName}</span>
              <span>{day.day}</span>
            </div>
            <div className="bookings">
              {day.bookings.map(booking => (
                <div key={booking.appointmentId} className={`booking ${booking.status}`}>
                  <span>{booking.time}</span>
                  <span>{booking.patient.firstName} {booking.patient.lastName}</span>
                  <span className="appointment-type">{booking.appointmentType}</span>
                </div>
              ))}
            </div>
            <div className="day-stats">
              <span>Total: {day.totalBookings}</span>
              <span>Confirmed: {day.confirmedBookings}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="monthly-stats">
        <h3>Monthly Summary</h3>
        <p>Total: {calendarData.monthlyStats.totalBookings}</p>
        <p>Confirmed: {calendarData.monthlyStats.confirmedBookings}</p>
        <p>Pending: {calendarData.monthlyStats.pendingBookings}</p>
        <p>Completed: {calendarData.monthlyStats.completedBookings}</p>
        <p>Cancelled: {calendarData.monthlyStats.cancelledBookings}</p>
      </div>
    </div>
  );
};
```

## Error Handling

### Common Error Scenarios

1. **Missing Parameters**: Returns 400 with "Year and month are required"
2. **Invalid Year**: Returns 500 with "Invalid year"
3. **Invalid Month**: Returns 500 with "Invalid month"
4. **Invalid Token**: Returns 401 with "Doctor ID not found in token"
5. **Server Error**: Returns 500 with "Internal server error"

### Frontend Error Handling

```javascript
const handleCalendarError = (error, response) => {
  if (response.status === 400) {
    alert('Please provide valid year and month parameters');
  } else if (response.status === 401) {
    alert('Please login again - your session has expired');
    // Redirect to login page
  } else {
    alert('An error occurred while loading the calendar');
  }
};
```

## Performance Considerations

- The API efficiently queries appointments for the specified date range
- Patient details are fetched lazily to minimize database load
- Results are sorted by date and time for easy frontend rendering
- Monthly statistics are calculated in-memory to avoid additional database queries

## Security Notes

- Requires valid doctor authentication token
- Doctor can only access their own appointment data
- Patient information is included but sensitive data is not exposed
- Token validation happens at the middleware level