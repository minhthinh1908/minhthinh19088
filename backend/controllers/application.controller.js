import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import nodemailer from 'nodemailer';

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "ID công việc là bắt buộc.",
                success: false
            })
        };
        // kiểm tra xem người dùng đã nộp đơn xin việc này chưa
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "Bạn đã nộp đơn xin việc này rồi.",
                success: false
            });
        }

        // kiểm tra xem công việc có tồn tại không
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Công việc không tìm thấy.",
                success: false
            })
        }
        // tạo một đơn xin việc mới
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message: "Nộp đơn xin việc thành công.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'company',
                options: { sort: { createdAt: -1 } },
            }
        });
        if (!application) {
            return res.status(404).json({
                message: "Không có đơn xin việc.",
                success: false
            })
        };
        return res.status(200).json({
            application,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// admin sẽ xem được số lượng người dùng đã nộp đơn
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant'
            }
        });
        if (!job) {
            return res.status(404).json({
                message: 'Công việc không tìm thấy.',
                success: false
            })
        };
        return res.status(200).json({
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
const sendEmail = async (recipientEmail, subject, content) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', // Hoặc host SMTP của bạn
            port: 587,
            secure: false, // true cho SSL, false cho TLS
            auth: {
                user: 'minhthinh1908@gmail.com', // Email của bạn
                pass: 'ldopuxihokmfkvzf', // Mật khẩu hoặc App Password
            },
        });

        const mailOptions = {
            from: '"Cong Ty ABC" <minhthinh1908@gmail.com>', // Tên và email gửi
            to: recipientEmail, // Email người nhận
            subject: subject, // Chủ đề email
            html: content, // Nội dung email (HTML)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
    }
};

// Hàm tạo nội dung email
const generateEmailContent = (type, applicant, details) => {
    switch (type) {
        case 3: // Mời phỏng vấn
            return `
                <h1>Thư mời phỏng vấn</h1>
                <p>Kính gửi ${applicant.fullname},</p>
                <p>Chúng tôi rất vui mừng mời bạn tham gia buổi phỏng vấn tại công ty ABC chúng tôi.</p>
                <p><strong>Ngày phỏng vấn:</strong> ${details.interviewDate}</p>
                <p><strong>Thời gian:</strong> ${details.interviewTime}</p>
                <p><strong>Địa điểm:</strong> ${details.interviewLocation}</p>
                <p>Vui lòng đến đúng giờ và mang theo các giấy tờ cần thiết.</p>
                <p>Trân trọng,</p>
                <p>Đội ngũ tuyển dụng</p>
            `;
        case 4: // Kết quả phỏng vấn
            return `
                <h1>Kết quả phỏng vấn</h1>
                <p>Kính gửi ${applicant.fullname},</p>
                <p>Chúng tôi xin thông báo kết quả buổi phỏng vấn của bạn như sau:</p>
                <p>${details.interviewResult}</p>
                <p>Trân trọng,</p>
                <p>Đội ngũ tuyển dụng</p>
            `;
        case 5: // Thư mời nhận việc
            return `
                <h1>Thư mời nhận việc</h1>
                <p>Kính gửi ${applicant.fullname},</p>
                <p>Chúng tôi rất vui mừng thông báo rằng bạn đã được chọn để gia nhập công ty ABC chúng tôi.</p>
                <p><strong>Mức lương:</strong> ${details.offerSalary}</p>
                <p><strong>Ngày bắt đầu:</strong> ${details.startDate}</p>
                <p>Vui lòng phản hồi email này để xác nhận nhận việc.</p>
                <p>Trân trọng,</p>
                <p>Đội ngũ tuyển dụng</p>
            `;
        default:
            return '';
    }
};

// Hàm cập nhật trạng thái và gửi email
export const updateStatus = async (req, res) => {
    try {
        const { status, details } = req.body; // Nhận `status` và `details` từ client
        const applicationId = req.params.id;

        // Kiểm tra nếu `status` không hợp lệ
        if (status === undefined || ![0, 1, 2, 3, 4, 5].includes(status)) {
            return res.status(400).json({
                message: 'Trạng thái không hợp lệ.',
                success: false,
            });
        }

        // Tìm đơn xin việc theo ID
        const application = await Application.findById(applicationId).populate('applicant'); // Giả sử `applicant` là tham chiếu
        if (!application) {
            return res.status(404).json({
                message: 'Đơn xin việc không tìm thấy.',
                success: false,
            });
        }

        // Cập nhật trạng thái và thông tin chi tiết (nếu có)
        application.status = status;
        if (details) {
            application.details = { ...application.details, ...details }; // Gộp thông tin mới vào `details`
        }

        await application.save();

        // Gửi email nếu trạng thái là 3, 4, hoặc 5
        if ([3, 4, 5].includes(status)) {
            const emailContent = generateEmailContent(status, application.applicant, details);
            if (emailContent) {
                await sendEmail(application.applicant.email, `Thông báo: ${STATUS_MAPPING[status]}`, emailContent);
            }
        }

        return res.status(200).json({
            message: 'Trạng thái đã được cập nhật thành công.',
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Đã xảy ra lỗi khi cập nhật trạng thái.',
            success: false,
        });
    }
};

// STATUS_MAPPING: Ánh xạ trạng thái
const STATUS_MAPPING = {
    0: 'Pending',
    1: 'Accepted',
    2: 'Rejected',
    3: 'Mời phỏng vấn',
    4: 'Kết quả phỏng vấn',
    5: 'Thư mời nhận việc',
};