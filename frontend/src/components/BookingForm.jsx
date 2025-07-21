import React from 'react';

const BookingForm = () => {
  return (
    <div className="booking-form-card">
      <h2>Tìm chuyến đi của bạn</h2>
      <form>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fromLocation">Nơi đi</label>
            <select id="fromLocation">
              <option>Hà Nội</option>
              <option>TP. Hồ Chí Minh</option>
              <option>Đà Nẵng</option>
              <option>Hải Phòng</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="toLocation">Nơi đến</label>
            <select id="toLocation">
              <option>TP. Hồ Chí Minh</option>
              <option>Hà Nội</option>
              <option>Đà Nẵng</option>
              <option>Sapa</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fromDate">Ngày đi</label>
            <input type="date" id="fromDate" />
          </div>
          <div className="form-group">
            <label htmlFor="ticketType">Loại vé</label>
            <select id="ticketType">
              <option>Một chiều</option>
              <option>Khứ hồi</option>
            </select>
          </div>
        </div>
        <div className="form-row">
           <div className="form-group">
            <label htmlFor="plateNumber">Biển số xe (Tùy chọn)</label>
            <input type="text" id="plateNumber" placeholder="e.g., 29A-123.45" />
          </div>
           <div className="form-group">
            <label htmlFor="seats">Số ghế</label>
            <input type="number" id="seats" defaultValue="1" min="1" max="10"/>
          </div>
        </div>
        <button type="submit" className="submit-btn">Tìm kiếm</button>
      </form>
    </div>
  );
};

export default BookingForm;