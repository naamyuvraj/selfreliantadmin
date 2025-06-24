export default function ContactPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 border-l-4 border-[#608C44] pl-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Contact Us</h1>
        <p className="text-xs sm:text-sm text-gray-500">Get in touch with our support team</p>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-4">
        <p className="text-gray-700">
          For any inquiries, feel free to reach out to us at:
        </p>

        <ul className="space-y-2 text-sm sm:text-base text-gray-800">
          <li>
            📧 <span className="font-medium">Email:</span>{" "}
            <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
              support@example.com
            </a>
          </li>
          <li>
            📞 <span className="font-medium">Phone:</span>{" "}
            <a href="tel:+919999999999" className="text-blue-600 hover:underline">
              +91 99999 99999
            </a>
          </li>
          <li>
            🏢 <span className="font-medium">Address:</span> 123 Artisan Street, Jaipur, Rajasthan
          </li>
        </ul>

        <p className="text-sm text-gray-500">
          Our support team is available from <span className="font-medium">10 AM to 6 PM</span>, Monday to Saturday.
        </p>
      </div>
    </div>
  );
}
