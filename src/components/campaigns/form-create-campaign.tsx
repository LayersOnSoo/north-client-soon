/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { storeFile } from "@/services/ipfs";
import { DateTimePicker } from "@/components/time";
import { toast } from "react-toastify";

import { useWallet } from "@solana/wallet-adapter-react";
import { createCampaign } from "@/services/programs";
import { SessionContext } from "../wallets/sessions";
import { fileToBase64 } from "@/utils";
import { add } from "date-fns";

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),

  admission_proof_url: z
    .any()
    .refine((files) => {
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, `Max image size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),

  university_name: z.string().min(2, {
    message: "University Name must be at least 2 characters.",
  }),
  matric_number: z.string().min(2, {
    message: "Matriculation Number must be at least 2 characters.",
  }),
  course_of_study: z.string().min(2, {
    message: "Course of Study must be at least 2 characters.",
  }),
  year_of_entry: z.coerce.number().int().gte(1900, {
    message: "Year of entry must be a valid year.",
  }),

  student_image_url: z
    .any()
    .refine((files) => {
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, `Max image size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),

  student_result_image_url: z
    .any()
    .refine((files) => {
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, `Max image size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),

  funding_reason: z.string().min(10, {
    message: "Funding reason must be at least 10 characters.",
  }),

  project_link: z.string().url(),

  goal: z.coerce.number().gt(0, {
    message: "Goal must be a positive number.",
  }),
  start_at: z.date({ message: "Start date must be a valid date." }),
  end_at: z.date({ message: "End date must be a valid date." }),
});

export default function FormCreateCampaign() {
  const [studentImage, setStudentImage] = useState<File | null>(null);
  const [resultImage, setResultImage] = useState<File | null>(null);
  const [admissionProof, setAdmissionProof] = useState<File | null>(null);
  const { program } = useContext(SessionContext);
  const { publicKey } = useWallet();
  const defautStartDate = add(new Date(), { minutes: 5 });
  const defautEndDate = add(new Date(), { days: 1 });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      title: "",
      name: "",

      university_name: "",
      admission_proof_url: undefined,

      matric_number: "",
      course_of_study: "",
      year_of_entry: 2000,

      student_image_url: undefined,
      student_result_image_url: undefined,

      funding_reason: "",
      project_link: "",

      goal: 1,
    },
  });

  async function storeDataToBackend(campaignData: any) {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/campaign/create-campaign",
        campaignData
      );

      if (response.status === 201) {
        console.log(response.data);
        toast.success("Campaign created successfully in the backend!");
        return true; // Successfully created in backend
      } else {
        throw new Error("Failed to create campaign in backend.");
      }
    } catch (error: any) {
      toast.error(`Error sending campaign data to backend: ${error.message}`);
      throw error; // Rethrow error to propagate it
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!program || !publicKey) {
      toast.error("connect your wallet");
      return;
    }

    const currentDate = new Date();

    if (values.start_at.getTime() <= currentDate.getTime()) {
      toast.error("start time is too early");
      return;
    }

    if (values.end_at.getTime() <= values.start_at.getTime()) {
      toast.error("end date must be greater than start date");
      return;
    }

    // Helper function to transform and store file to IPFS
    const storeImageToIPFS = async (file: File | null, title: string) => {
      if (!file) {
        toast.error("No file selected");
        return null;
      }

      /**
       * Transform file
       */
      const base64File = await fileToBase64(file);
      console.log("Base64 File:", base64File);

      const mimeType = file.type;
      console.log("MIME Type:", mimeType);

      const fileData = {
        fileData: base64File,
        fileName: file.name,
        mimeType: mimeType,
      };

      /**
       * Store Image to IPFS
       */
      const { result, errors } = await storeFile(fileData, title);
      if (errors) {
        toast.error("Failed to store image to IPFS");
        return null;
      }
      return result?.IpfsHash;
    };

    const [studentImageCID, admissionProofCID, resultImageCID] =
      await Promise.all([
        storeImageToIPFS(studentImage, values.title),
        storeImageToIPFS(admissionProof, values.title),
        storeImageToIPFS(resultImage, values.title),
      ]);

    if (!studentImageCID || !admissionProofCID || !resultImageCID) {
      toast.error("Failed to upload one or more files to IPFS");
      return;
    }

    try {
      const campaignData = {
        email: values.email,
        title: values.title,
        name: values.name,
        admission_proof_url: admissionProofCID,
        university_name: values.university_name,
        matric_number: values.matric_number,
        course_of_study: values.course_of_study,
        year_of_entry: values.year_of_entry,
        student_image_url: studentImageCID,
        student_result_image_url: resultImageCID,
        funding_reason: values.funding_reason,
        project_link: values.project_link,
        goal: values.goal,
        start_at: values.start_at,
        end_at: values.end_at,
      };

      // 1. Send campaign data to the MongoDB backend
      storeDataToBackend(campaignData).then(() => {
        console.log("Sent to backend successfully!");
      });

      // //  then send data to the blockchain
      const tx = await createCampaign(program, publicKey, {
        email: values.email,
        title: values.title,
        name: values.name,

        admission_proof_url: admissionProofCID,
        university_name: values.university_name,

        matric_number: values.matric_number,
        course_of_study: values.course_of_study,
        year_of_entry: values.year_of_entry,

        student_image_url: studentImageCID,
        student_result_image_url: resultImageCID,

        funding_reason: values.funding_reason,
        project_link: values.project_link,

        goal: values.goal,
        start_at: values.start_at,
        end_at: values.end_at,
      });

      console.log(tx);

      toast.success("campaign created");
      form.reset();
    } catch (error: any) {
      toast.error(error.message);
      console.log(error, error.message);
    }
  }

  return (
    <Card className="mt-6 rounded-lg border-none">
      <CardContent className="p-6">
        <div className="flex min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] flex-row items-center justify-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-8 md:w-[500px]"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your email address.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project title" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your project title.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormDescription>This is your name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="admission_proof_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admission Proof</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          setAdmissionProof(e.target.files?.[0] || null);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload your admission proof image.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="university_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter university name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your university name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="matric_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Matriculation Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter matriculation number"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your matriculation number.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="course_of_study"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course of Study</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter course of study" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your course of study.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year_of_entry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year of Entry</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter year of entry"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your year of entry.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="student_image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          setStudentImage(e.target.files?.[0] || null);
                        }}
                      />
                    </FormControl>
                    <FormDescription>Upload your image.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="student_result_image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Result Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          setResultImage(e.target.files?.[0] || null);
                        }}
                      />
                    </FormControl>
                    <FormDescription>Upload your result image.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="funding_reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funding Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the reason for funding"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a reason for funding.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="project_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Social Link</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project link" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the link to your active social media.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funding Goal (SOL)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter funding goal"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your funding goal.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        defautDate={defautStartDate}
                        onUpdateDate={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your campaign start date.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        defautDate={defautEndDate}
                        onUpdateDate={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your campaign end date.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
