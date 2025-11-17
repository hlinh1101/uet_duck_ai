// Chờ cho toàn bộ trang web được tải xong
document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');

    // Địa chỉ Back-end của bạn
    const backendUrl = 'http://localhost:3000/chat';

    // Xử lý khi người dùng gửi tin nhắn
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Ngăn trang web tải lại

        const userMessage = userInput.value.trim();
        if (userMessage === '') return;

        // Hiển thị tin nhắn của người dùng
        addMessage(userMessage, 'user');
        userInput.value = ''; // Xóa nội dung trong ô nhập liệu

        try {
            // Gửi tin nhắn đến Back-end
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: userMessage }),
            });

            if (!response.ok) {
                throw new Error('Lỗi từ máy chủ');
            }

            const data = await response.json();

            // Hiển thị tin nhắn trả về từ AI (Gemini)
            addMessage(data.response, 'ai');

        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
            addMessage('Xin lỗi, mình gặp chút trục trặc. Bạn thử lại sau nhé!', 'ai');
        }
    });

    // Hàm trợ giúp để thêm tin nhắn vào khung chat
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.innerHTML = `<p>${text}</p>`; // Dùng innerHTML hoặc textContent
        chatBox.appendChild(messageElement);

        // Tự động cuộn xuống tin nhắn mới nhất
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});