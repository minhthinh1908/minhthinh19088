import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
export const postJob = async (req, res) => {
    try {
        const {
            title,
            description,
            requirements,
            salary,
            salaryType,
            location,
            jobType,
            experienceLevel,
            position,
            companyId,
            contactPerson,
            contactPhone,
            contactEmail,
            contactAddress,
            workplace,
            education,
            jobLevel,
            gender,
            industry,
            age,
            companyIntro,
            employeeCount,
            benefits
        } = req.body;

        const userId = req.id;

        // Kiểm tra các trường bắt buộc
        const missingFields = [];
        if (!title) missingFields.push("title");
        if (!description) missingFields.push("description");
        if (!requirements) missingFields.push("requirements");
        if (!salary) missingFields.push("salary");
        if (!location) missingFields.push("location");
        if (!jobType) missingFields.push("jobType");
        if (!experienceLevel) missingFields.push("experienceLevel");
        if (!position) missingFields.push("position");
        if (!companyId) missingFields.push("companyId");
        if (!contactPerson) missingFields.push("contactPerson");
        if (!contactPhone) missingFields.push("contactPhone");
        if (!contactEmail) missingFields.push("contactEmail");
        if (!contactAddress) missingFields.push("contactAddress");

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Thiếu thông tin: ${missingFields.join(", ")}.`,
                success: false,
            });
        }

        // Xử lý giá trị salary
        const parsedSalary = parseFloat(salary);
        if (isNaN(parsedSalary) || parsedSalary <= 0) {
            return res.status(400).json({
                message: "Mức lương không hợp lệ!",
                success: false,
            });
        }

        // Chuẩn hóa các trường dữ liệu
        const parsedRequirements = requirements.split(",").map((req) => req.trim());
        const parsedBenefits = Array.isArray(benefits) ? benefits.map((benefit) => benefit.trim()) : [];

        // Tạo công việc mới
        const job = await Job.create({
            title,
            description,
            requirements: parsedRequirements,
            salary: parsedSalary,
            salaryType,
            location,
            jobType,
            experienceLevel,
            position,
            company: companyId,
            contactPerson,
            contactPhone,
            contactEmail,
            contactAddress,
            workplace,
            education,
            jobLevel,
            gender,
            industry,
            age,
            companyIntro,
            employeeCount,
            benefits: parsedBenefits,
            created_by: userId,
        });

        return res.status(201).json({
            message: "Đăng công việc thành công!",
            success: true,
            data: job,
        });
    } catch (error) {
        console.error("Lỗi khi đăng công việc:", error);
        return res.status(500).json({
            message: "Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại.",
            success: false,
        });
    }
};


export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";

        let query = {
            title: { $exists: true, $ne: null, $ne: "", $ne: "undefined" }, // Đảm bảo title hợp lệ
            description: { $exists: true, $ne: null, $ne: "", $ne: "undefined" }, // Đảm bảo description hợp lệ
            isActive: "active" // Chỉ lấy các công việc có isActive là "active"
        };

        if (keyword) {
            // Nếu có từ khóa, tách từ khóa thành các từ riêng lẻ
            const keywordsArray = keyword.split(" ").filter(k => k.trim() !== "");
            query.$or = [
                { title: { $regex: keywordsArray.join("|"), $options: "i" } },
                { description: { $regex: keywordsArray.join("|"), $options: "i" } },
            ];
        }

        // Tìm kiếm công việc và sắp xếp theo thời gian mới nhất
        const jobs = await Job.find(query)
            .populate({ path: "company" })
            .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo giảm dần

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy công việc.",
                success: false
            });
        }

        return res.status(200).json({
            jobs,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi server.",
            success: false
        });
    }
};

// sinh viên
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Không tìm thấy công việc.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}

// admin xem số lượng công việc đã tạo
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path: 'company',
            createdAt: -1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Không tìm thấy công việc.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const getJobWithCompanyLogo = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate("company");

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: "Error fetching job", error });
    }
}; 
export const updateJob = async (req, res) => {
    try {
        console.log("Dữ liệu nhận được từ client:", req.body); // In ra dữ liệu nhận được
        console.log("Job ID:", req.params.id); // In ra jobId

        const jobId = req.params.id;
        const {
            title,
            description,
            requirements,
            salary,
            salaryType,
            location,
            jobType,
            experienceLevel,
            position,
            companyId,
            contactPerson,
            contactPhone,
            contactEmail,
            contactAddress,
            workplace,
            education,
            jobLevel,
            gender,
            industry,
            age,
            companyIntro,
            employeeCount,
            benefits,
        } = req.body;

        // Kiểm tra các trường bắt buộc
        const missingFields = [];
        if (!title) missingFields.push("title");
        if (!description) missingFields.push("description");
        if (!requirements) missingFields.push("requirements");
        if (!salary) missingFields.push("salary");
        if (!location) missingFields.push("location");
        if (!jobType) missingFields.push("jobType");
        if (!experienceLevel) missingFields.push("experienceLevel");
        if (!position) missingFields.push("position");
        if (!companyId) missingFields.push("companyId");
        if (!contactPerson) missingFields.push("contactPerson");
        if (!contactPhone) missingFields.push("contactPhone");
        if (!contactEmail) missingFields.push("contactEmail");
        if (!contactAddress) missingFields.push("contactAddress");

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Thiếu thông tin: ${missingFields.join(", ")}.`,
                success: false,
            });
        }

        // Xử lý giá trị salary
        const parsedSalary = parseFloat(salary);
        if (isNaN(parsedSalary) || parsedSalary <= 0) {
            return res.status(400).json({
                message: "Mức lương không hợp lệ!",
                success: false,
            });
        }

        // Kiểm tra companyId
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Không tìm thấy công ty.",
                success: false,
            });
        }

        // Chuẩn hóa các trường dữ liệu
        const parsedRequirements = Array.isArray(requirements) ? requirements : [requirements];
        const parsedBenefits = Array.isArray(benefits) ? benefits : [benefits];

        // Tìm và cập nhật công việc
        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            {
                title,
                description,
                requirements: parsedRequirements,
                salary: parsedSalary,
                salaryType,
                location,
                jobType,
                experienceLevel,
                position,
                company: companyId,
                contactPerson,
                contactPhone,
                contactEmail,
                contactAddress,
                workplace,
                education,
                jobLevel,
                gender,
                industry,
                age,
                companyIntro,
                employeeCount,
                benefits: parsedBenefits,
            },
            { new: true }
        );

        if (!updatedJob) {
            return res.status(404).json({
                message: "Không tìm thấy công việc để cập nhật.",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Cập nhật công việc thành công!",
            success: true,
            data: updatedJob,
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật công việc:", error); // In ra lỗi chi tiết
        return res.status(500).json({
            message: "Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại.",
            success: false,
        });
    }
};