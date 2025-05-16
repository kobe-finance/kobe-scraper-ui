import React from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Form,
  FormInput,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalTrigger,
  useFormController,
} from '../';

interface FormValues {
  name: string;
  url: string;
  maxDepth: string;
  followExternalLinks: boolean;
}

export const ComponentDemo: React.FC = () => {
  const [modalOpen, setModalOpen] = React.useState(false);

  // Form setup with React Hook Form
  const form = useFormController<FormValues>({
    defaultValues: {
      name: '',
      url: '',
      maxDepth: '3',
      followExternalLinks: false,
    },
    mode: 'onChange',
  });

  const handleSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Button Component</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button isLoading>Loading Button</Button>
          <Button 
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            }
          >
            With Icon
          </Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Input Component</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Default Input" placeholder="Enter text" />
          <Input 
            label="With Icon" 
            placeholder="Search..." 
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            } 
          />
          <Input 
            label="Error State" 
            error="This field is required" 
            placeholder="Enter text" 
          />
          <Input 
            label="Success State" 
            success 
            placeholder="Enter text" 
            value="Validated input"
          />
          <Input 
            label="With Helper Text" 
            placeholder="Enter URL" 
            helperText="Enter a valid URL including http://" 
          />
          <Input 
            label="Disabled Input" 
            placeholder="Cannot be edited" 
            disabled 
          />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Card Component</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader title="Basic Card" description="A simple card component" />
            <CardContent>
              <p>This is the content of the card. You can put any elements here.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">Cancel</Button>
              <Button size="sm" className="ml-2">Save</Button>
            </CardFooter>
          </Card>
          
          <Card isHoverable>
            <CardHeader 
              title="Hoverable Card" 
              description="This card has a hover effect"
              action={<Button variant="ghost" size="sm">View</Button>}
            />
            <CardContent>
              <p>Hover over this card to see the effect. It features a subtle shadow enhancement.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Form Component with React Hook Form</h2>
        <Card>
          <CardHeader title="Scraper Configuration" description="Set up your web scraper parameters" />
          <CardContent>
            <Form form={form} onSubmit={handleSubmit} className="space-y-4">
              <FormInput 
                name="name" 
                label="Scraper Name" 
                placeholder="Enter a name for this scraper"
              />
              <FormInput 
                name="url" 
                label="Target URL" 
                placeholder="https://example.com"
                helperText="The website you want to scrape"
              />
              <FormInput 
                name="maxDepth" 
                label="Max Depth" 
                type="number" 
                helperText="Maximum crawl depth (1-10)"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="followExternalLinks"
                  {...form.register('followExternalLinks')}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="followExternalLinks" className="text-sm font-medium text-gray-700">
                  Follow External Links
                </label>
              </div>
            </Form>
          </CardContent>
          <CardFooter>
            <Button variant="outline" type="button">Cancel</Button>
            <Button 
              type="submit" 
              onClick={form.handleSubmit(handleSubmit)}
              className="ml-2"
            >
              Create Scraper
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Modal Component</h2>
        <Modal open={modalOpen} onOpenChange={setModalOpen}>
          <ModalTrigger asChild>
            <Button>Open Modal</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Confirmation</ModalTitle>
              <ModalDescription>
                Are you sure you want to start this scraping job? This will use your account credits.
              </ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button className="ml-2" onClick={() => {
                alert('Scraping job started!');
                setModalOpen(false);
              }}>
                Start Job
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default ComponentDemo;
