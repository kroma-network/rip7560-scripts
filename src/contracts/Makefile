include .env
export $(shell sed 's/=.*//' .env)

build:
	forge compile

deploy:
	forge script script/Deploy.s.sol:DeployScript --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) --broadcast | grep "LOG" > temp.txt
	@echo "\n [Deployed contract info]"
	@cat temp.txt
	@rm temp.txt

deploy-safe:
	forge script script/DeployDilithium.s.sol:DeployDilithiumScript --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) --broadcast  | grep "LOG" > temp.txt
	@echo "\n [Deployed contract info]"
	@cat temp.txt
	@rm temp.txt
