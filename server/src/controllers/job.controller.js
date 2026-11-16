import { Job } from '../models/job.model.js';

/**
 * Controller: Get job status by ID
 * GET /api/jobs/:id
 */
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch job status',
    });
  }
};

/**
 * Controller: Get all jobs for current user
 * GET /api/jobs
 */
export const getUserJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(20);

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error('Error fetching user jobs:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
    });
  }
};

